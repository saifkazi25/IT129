"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef(null); // ✅ don't type as Webcam — it's a component, not a type
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const uploadToCloudinary = async (imageDataUrl: string): Promise<string | null> => {
    const cloudName = "djm1jppes";
    const uploadPreset = "infinite_tsukuyomi";

    const formData = new FormData();
    formData.append("file", imageDataUrl);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("❌ Cloudinary upload failed:", data);
        return null;
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return null;
    }
  };

  const capture = async () => {
    if (!webcamRef.current) return;

    const webcamInstance = webcamRef.current as any;
    const imageSrc = webcamInstance.getScreenshot();

    if (!imageSrc) {
      console.error("❌ Failed to capture image");
      return;
    }

    setUploading(true);
    setSelfiePreview(imageSrc);

    const uploadedUrl = await uploadToCloudinary(imageSrc);
    if (uploadedUrl) {
      localStorage.setItem("selfieUrl", uploadedUrl);
      router.push("/result");
    } else {
      alert("Failed to upload selfie. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Capture Your Selfie</h1>
      {!selfiePreview ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-md"
          />
          <button
            onClick={capture}
            disabled={uploading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Capture & Continue"}
          </button>
        </>
      ) : (
        <>
          <img src={selfiePreview} alt="Selfie Preview" className="rounded-lg shadow-md mb-4" />
          <p className="text-green-600">✅ Selfie captured and uploaded!</p>
        </>
      )}
    </div>
  );
}
