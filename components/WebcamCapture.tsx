"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null);
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

    try {
      const cloudinaryUrl = await uploadToCloudinary(imageSrc);
      localStorage.setItem("selfieUrl", cloudinaryUrl);
      setSelfiePreview(cloudinaryUrl);
      console.log("✅ Selfie uploaded to Cloudinary:", cloudinaryUrl);

      // ✅ Immediately redirect after successful upload
      router.push("/result");
    } catch (err: any) {
      console.error("❌ Cloudinary Upload Error:", err);
      setError("Failed to upload selfie. Try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

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
        <img
          src={selfiePreview}
          alt="Selfie"
          className="rounded-lg shadow-lg w-full max-w-md mb-4"
        />
      )}

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
