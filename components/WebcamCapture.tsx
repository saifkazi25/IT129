"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieUrlReady, setSelfieUrlReady] = useState(false);

  const uploadToCloudinary = async (imageDataUrl: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", imageDataUrl);
    formData.append("upload_preset", "infinite_tsukuyomi");

    const response = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed.");
    }

    return data.secure_url;
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setUploading(true);
    setError("");
    setSelfieUrlReady(false);

    try {
      const cloudinaryUrl = await uploadToCloudinary(imageSrc);

      localStorage.setItem("selfieUrl", cloudinaryUrl);
      setSelfiePreview(cloudinaryUrl);
      setSelfieUrlReady(true);
      console.log("✅ Selfie uploaded:", cloudinaryUrl);
    } catch (err: any) {
      console.error("❌ Cloudinary upload error:", err);
      setError("Failed to upload selfie. Try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const goToResult = () => {
    const selfieUrl = localStorage.getItem("selfieUrl");
    if (!selfieUrl) {
      setError("Selfie not uploaded yet.");
      return;
    }
    router.push("/result");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {!selfiePreview ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-md mb-4"
          />
          <button
            onClick={capture}
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Capture Selfie"}
          </button>
        </>
      ) : (
        <>
          <img
            src={selfiePreview}
            alt="Selfie"
            className="rounded-lg shadow-lg w-full max-w-md mb-4"
          />
          <button
            onClick={goToResult}
            disabled={!selfieUrlReady}
            className={`${
              selfieUrlReady
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-6 py-2 rounded`}
          >
            Continue to Result
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
