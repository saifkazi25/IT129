"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
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

  const captureAndUpload = async () => {
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      setError("Failed to capture selfie.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", screenshot);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const cloudName = "djm1jppes";
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageUrl = response.data.secure_url;
      localStorage.setItem("selfieUrl", imageUrl);
      router.push("/result");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setCameraReady(true))
      .catch(() => setError("Camera access denied."));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Take a Selfie</h1>

      {cameraReady && webcamRef ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-lg shadow-md mb-4"
        />
      ) : (
        <p>Loading camera...</p>
      )}

      <button
        onClick={captureAndUpload}
        disabled={!cameraReady || uploading}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Capture & Continue"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
