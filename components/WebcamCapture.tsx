"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // ✅ FIXED: avoid type error
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError("Selfie capture failed. Please try again.");
      return;
    }

    setUploading(true);
    uploadToCloudinary(imageSrc);
  };

  const uploadToCloudinary = async (imageDataUrl: string) => {
    try {
      const data = new FormData();
      data.append("file", imageDataUrl);
      data.append("upload_preset", "infinite_tsukuyomi");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/djm1jppes/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const json = await res.json();
      if (json.secure_url) {
        localStorage.setItem("selfieUrl", json.secure_url);
        router.push("/result");
      } else {
        throw new Error("Upload failed.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Selfie upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Capture Your Selfie</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
        className="rounded-lg shadow-md mb-4"
      />

      <button
        onClick={capture}
        disabled={uploading}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {uploading ? "Uploading..." : "Capture & Continue"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
