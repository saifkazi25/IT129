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

  const uploadToCloudinary = async (imageDataUrl: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", imageDataUrl);
    formData.append("upload_preset", "infinite_tsukuyomi");

    const res = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.secure_url) throw new Error("❌ Cloudinary upload failed");

    return data.secure_url;
  };

  const captureAndGenerate = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("❌ Could not capture selfie.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Upload selfie to Cloudinary
      const selfieUrl = await uploadToCloudinary(imageSrc);
      console.log("✅ Uploaded selfie to Cloudinary:", selfieUrl);

      // Grab quiz answers from localStorage
      const quizRaw = localStorage.getItem("quizAnswers");
      if (!quizRaw) throw new Error("❌ No quiz answers found");

      const quizAnswers = JSON.parse(quizRaw);

      // Submit to API directly
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAnswers, selfieUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) throw new Error("❌ Image generation failed");

      router.push(`/result?imageUrl=${encodeURIComponent(data.imageUrl)}`);
    } catch (err: any) {
      console.error("⚠️ Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-md mb-4"
      />

      <button
        onClick={captureAndGenerate}
        disabled={uploading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {uploading ? "Generating..." : "Capture & Generate"}
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
