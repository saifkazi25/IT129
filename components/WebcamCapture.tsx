"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

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

  const capture = async () => {
    if (!webcamRef.current) {
      setError("Camera not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError("Failed to capture image");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }

      localStorage.setItem("selfieUrl", data.secure_url);

      // Add a short delay to ensure localStorage writes before routing
      setTimeout(() => {
        router.push("/result");
      }, 300);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload selfie");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Check camera access
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraReady(true))
      .catch(() => setError("Camera access denied"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <h1 className="text-xl font-bold">Take a Selfie</h1>

      {error && <p className="text-red-500">{error}</p>}

      {cameraReady ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded shadow-lg"
          />
          <button
            onClick={capture}
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Capture & Continue"}
          </button>
        </>
      ) : (
        <p>Loading camera...</p>
      )}
    </div>
  );
}
