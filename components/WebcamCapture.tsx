"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import type { WebcamProps } from "react-webcam"; // Optional, only if customizing props
import { useRouter } from "next/navigation";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null); // ✅ FIXED LINE
  const router = useRouter();

  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

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
      throw new Error("Failed to upload image to Cloudinary.");
    }

    return data.secure_url;
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setUploading(true);
    setError("");

    try {
      const cloudinaryUrl = await uploadToCloudinary(imageSrc);
      localStorage.setItem("selfieUrl", cloudinaryUrl);
      setSelfiePreview(cloudinaryUrl);
      console.log("✅ Uploaded selfie to Cloudinary:", cloudinaryUrl);
    } catch (err: any) {
      setError("Error uploading selfie. Please try again.");
      console.error("❌ Upload error:", err);
    } finally {
      setUploading(false);
    }
  }, []);

  const goToResult = () => {
    router.push("/result");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
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
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {uploading ? "Uploading..." : "Capture Selfie"}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </>
      ) : (
        <>
          <img src={selfiePreview} alt="Your Selfie" className="rounded-lg shadow-lg w-full max-w-md mb-4" />
          <button
            onClick={goToResult}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Continue to Fantasy World
          </button>
        </>
      )}
    </div>
  );
}
