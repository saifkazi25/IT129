"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieUploadedUrl, setSelfieUploadedUrl] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfiePreview(imageSrc);
      uploadToCloudinary(imageSrc);
    }
  }, []);

  const uploadToCloudinary = async (base64Image: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", base64Image);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        setSelfieUploadedUrl(data.secure_url);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateClick = () => {
    if (!selfieUploadedUrl) {
      alert("Selfie not uploaded yet!");
      return;
    }
    router.push("/result");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Step 2: Capture Your Selfie</h1>

      {!selfiePreview && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg shadow-md"
          videoConstraints={{ facingMode: "user" }}
        />
      )}

      {selfiePreview && (
        <img
          src={selfiePreview}
          alt="Captured"
          className="w-64 h-auto rounded-lg shadow-lg mb-4"
        />
      )}

      <div className="flex flex-col items-center space-y-4 mt-4">
        {!selfiePreview && (
          <button
            onClick={capture}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Capture Selfie
          </button>
        )}

        {uploading && <p className="text-yellow-600">Uploading selfie...</p>}

        {selfiePreview && !uploading && (
          <button
            onClick={handleGenerateClick}
            disabled={!selfieUploadedUrl}
            className={`px-6 py-2 rounded-lg ${
              selfieUploadedUrl
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            Generate My Fantasy
          </button>
        )}
      </div>
    </div>
  );
}
