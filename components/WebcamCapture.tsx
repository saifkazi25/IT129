"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture image.");
      return;
    }

    setUploading(true);
    try {
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const cloudName = "djm1jppes";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const selfieUrl = data.secure_url;

      if (!selfieUrl) throw new Error("Upload failed");

      // Save selfieUrl to localStorage
      localStorage.setItem("selfieUrl", selfieUrl);
      console.log("✅ Saved selfieUrl to localStorage:", selfieUrl);

      // Add slight delay before routing to allow localStorage to persist
      setTimeout(() => {
        router.push("/result");
      }, 300);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload selfie. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg border shadow-lg"
      />

      <button
        onClick={capture}
        disabled={uploading}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {uploading ? "Uploading..." : "Capture Selfie"}
      </button>
    </div>
  );
}
