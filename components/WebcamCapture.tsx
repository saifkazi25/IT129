"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import type { Webcam as WebcamType } from "react-webcam";
import { useRouter } from "next/navigation";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef<WebcamType | null>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const capture = useCallback(async () => {
    if (!webcamRef.current) {
      setError("Webcam not ready.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError("Failed to capture image.");
      return;
    }

    try {
      setUploading(true);
      console.log("📸 Captured selfie image. Uploading to Cloudinary...");

      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djm1jppes/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const cloudinaryUrl = data.secure_url;

      if (!cloudinaryUrl) {
        throw new Error("❌ Cloudinary did not return a URL.");
      }

      localStorage.setItem("selfieUrl", cloudinaryUrl);
      console.log("✅ Selfie URL saved:", cloudinaryUrl);

      // Delay to allow storage to complete
      setTimeout(() => {
        router.push("/result");
      }, 500);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg mb-4"
      />
      <button
        onClick={capture}
        disabled={uploading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Capture & Continue"}
      </button>
    </div>
  );
}
