import React, { useState, useEffect } from "react";
import Resizer from "react-image-file-resizer";

const App = () => {
  const [image, setImage] = useState(null);
  const [resizedImages, setResizedImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const sizes = [
    { width: 300, height: 250 },
    { width: 728, height: 90 },
    { width: 160, height: 600 },
    { width: 300, height: 600 },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/gif"];
      if (!validFormats.includes(file.type)) {
        setError("Unsupported format. Use JPEG, PNG, or GIF.");
        return;
      }
      setError("");
      setImage(file);
    }
  };

  const resizeImage = (file, width, height) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve({ uri, width, height });
        },
        "file"
      );
    });
  };

  const handleResize = async () => {
    if (!image) {
      setError("Upload an image first.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const resizedImagesPromises = sizes.map((size) =>
        resizeImage(image, size.width, size.height)
      );
      const images = await Promise.all(resizedImagesPromises);
      setResizedImages(images);
      setSelectedImages([]);
    } catch (err) {
      setError("Error resizing images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-400 to-blue-500"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="max-w-3xl w-full bg-white/20 backdrop-blur-lg shadow-2xl rounded-xl p-10 border border-white/30">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center uppercase tracking-wide">
          Image Resizer
        </h1>

        <div className="flex flex-col items-center gap-6">
          <label className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="text-lg font-semibold text-gray-600">📷</span>
          </label>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            onClick={handleResize}
            disabled={loading || !image}
            className={`w-48 py-3 rounded-full font-bold text-lg text-white shadow-md transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Processing..." : "Resize Now"}
          </button>
        </div>

        {resizedImages.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Select Images to Upload
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {resizedImages.map((img, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/30 backdrop-blur-md rounded-lg shadow-md text-center transition-all hover:scale-105"
                >
                  <img
                    src={URL.createObjectURL(img.uri)}
                    alt={`Resized ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {img.width} x {img.height}
                  </p>
                  <div className="mt-2">
                    <label className="flex items-center justify-center cursor-pointer text-sm font-medium text-gray-800">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(img.uri)}
                        onChange={() =>
                          setSelectedImages((prev) =>
                            prev.includes(img.uri)
                              ? prev.filter((imgUri) => imgUri !== img.uri)
                              : [...prev, img.uri]
                          )
                        }
                        className="mr-2"
                      />
                      Upload
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                alert("Upload functionality isn't implemented yet!")
              }
              disabled={selectedImages.length === 0}
              className="mt-6 w-full py-3 rounded-full font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-lg transition-all duration-300"
            >
              Upload Selected Images 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
