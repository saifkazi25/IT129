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
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();

  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // 🛠️ FIX: Convert base64 to blob before uploading
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const uploadToCloudinary = async (imageDataUrl: string): Promise<string> => {
    const blob = dataUrlToBlob(imageDataUrl);
    const formData = new FormData();
    formData.append("file", blob); // 🧠 use blob instead of base64
    formData.append("upload_preset", "infinite_tsukuyomi");

    const response = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("🌥️ Cloudinary response:", data);

    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url;
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Failed to capture image.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const cloudinaryUrl = await uploadToCloudinary(imageSrc);
      localStorage.setItem("selfieUrl", cloudinaryUrl); // 💾 Save to localStorage
      setSelfiePreview(cloudinaryUrl);
      console.log("✅ Uploaded to Cloudinary:", cloudinaryUrl);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setError("Upload failed. Try again.");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {!selfiePreview ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded shadow-md mb-4"
          />
          <button
            onClick={capture}
            disabled={uploading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Capture & Upload"}
          </button>
        </>
      ) : (
        <>
          <img src={selfiePreview} alt="Selfie Preview" className="rounded-lg shadow-lg w-full max-w-md mb-4" />
          <button
            onClick={goToResult}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Continue to Result
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
