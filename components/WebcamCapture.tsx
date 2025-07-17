"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // FIXED: use 'any' to avoid TS error
  const router = useRouter();

  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const handleCapture = async () => {
    if (!webcamRef.current) {
      setError("Webcam not ready.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError("Failed to capture image.");
      return;
    }

    setCaptured(true);
    try {
      const uploadResponse = await axios.post("/api/upload", {
        image: imageSrc,
      });

      const { secure_url } = uploadResponse.data;

      if (!secure_url) {
        throw new Error("Upload failed.");
      }

      localStorage.setItem("selfieUrl", secure_url);
      router.push("/result");
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Image upload failed.");
    }
  };

  useEffect(() => {
    setCameraReady(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">📸 Capture Your Selfie</h1>

      {cameraReady && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-lg border shadow-md"
        />
      )}

      <button
        onClick={handleCapture}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={captured}
      >
        {captured ? "Captured!" : "Capture & Continue"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
