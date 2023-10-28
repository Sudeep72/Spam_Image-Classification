import React, { useState } from "react";
import Bg from "../assets/1.jpg";

const ImageClassification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadMessage, setShowUploadMessage] = useState(false);

  const handleImageUpload = async () => {
    const fileInput = document.getElementById("file-input");
    const file = fileInput.files[0];

    if (!file) {
      setShowUploadMessage(true);
      setTimeout(() => setShowUploadMessage(false), 3000);
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    setClassificationResult("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://your-backend-api-url/classify", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setClassificationResult(data.result);
      } else {
        setClassificationResult("Error occurred during classification");
      }
    } catch (error) {
      console.error("Error:", error);
      setClassificationResult("Error occurred during classification");
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    const fileInput = document.getElementById("file-input");
    fileInput.value = null;
    setSelectedImage(null);
    setClassificationResult("");
  };

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${Bg})` }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-accent">
              Image Classification
            </h1>
            <p className="mb-5 text-2xl font-semibold">
              Classify the image as{" "}
              <span className="text-error">Legitimate</span> or{" "}
              <span className="text-warning">Spam</span>
            </p>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-info w-full mb-5"
              id="file-input"
            />
            {isLoading ? (
              <p className="text-neutral text-xl">
                Loading{" "}
                <span className="loading loading-spinner text-neutral"></span>
              </p>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                {selectedImage && (
                  <button
                    className="btn btn-outline btn-warning"
                    onClick={clearImage}
                  >
                    Clear
                  </button>
                )}
                <button
                  className="btn btn-outline btn-info"
                  onClick={handleImageUpload}
                >
                  Classify
                </button>
              </div>
            )}
            {selectedImage && (
              <div className="flex flex-col items-center mt-5">
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-48 h-auto rounded-lg mb-4"
                />
                {classificationResult && (
                  <p className="font-bold text-2xl">
                    Classification Result:{" "}
                    <span
                      className={
                        classificationResult ===
                        "Error occurred during classification"
                          ? "text-red-700"
                          : "text-green-500"
                      }
                    >
                      {classificationResult}
                    </span>
                  </p>
                )}
              </div>
            )}
            {showUploadMessage && (
              <div className="toast toast-top toast-end">
                <div className="alert alert-warning">
                  <span>Please upload an image!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageClassification;
