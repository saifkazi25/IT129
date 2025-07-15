"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const handleCameraReady = () => {
    console.log("✅ Webcam ready");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      console.error("❌ Webcam ref is null");
      setError("Webcam not ready. Please try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      console.error("❌ Screenshot failed. getScreenshot() returned null");
      setError("Failed to capture selfie. Try again.");
      return;
    }

    console.log("✅ Screenshot captured. Saving selfie to localStorage...");
    localStorage.setItem("selfie", imageSrc);
    setCaptured(true);

    setTimeout(() => {
      router.push("/result");
    }, 300); // Give time for storage to sync
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-4">📸 Capture Your Selfie</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={handleCameraReady}
        className="rounded-lg shadow-lg mb-4"
      />

      <button
        onClick={capture}
        disabled={!cameraReady || captured}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        {captured ? "Selfie Captured ✅" : "Capture Selfie"}
      </button>
    </div>
  );
}
