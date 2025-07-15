"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCameraReady(true);
    }, 1000); // Give time for camera to initialize
    return () => clearTimeout(timeout);
  }, []);

  const captureAndUpload = useCallback(async () => {
    if (!webcamRef.current) {
      console.error("❌ Webcam ref is null");
      setError("Webcam not ready. Please try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.error("❌ Failed to capture image");
      setError("Failed to capture image.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/djm1jppes/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;
      console.log("✅ Uploaded selfie URL:", imageUrl);

      // Save to localStorage (just the URL, not base64)
      localStorage.setItem("selfieUrl", imageUrl);

      router.push("/result");
    } catch (err) {
      console.error("❌ Upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [webcamRef, router]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Take Your Selfie</h1>
      {cameraReady ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-md"
          />
          <button
            onClick={captureAndUpload}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Capture & Continue"}
          </button>
        </>
      ) : (
        <p>Loading camera...</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
