"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
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

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      console.error("❌ Webcam ref is null");
      setError("Webcam not ready. Please try again.");
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();

    if (!screenshot) {
      console.error("❌ Failed to capture screenshot");
      setError("Failed to capture selfie. Please try again.");
      return;
    }

    console.log("✅ Screenshot captured. Saving selfie to localStorage...");
    localStorage.setItem("selfie", screenshot);
    setCaptured(true);

    setTimeout(() => {
      console.log("🚀 Navigating to result page...");
      router.push("/result");
    }, 300); // Small delay to ensure localStorage is saved before routing
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">📸 Take Your Selfie</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-md shadow-lg mb-4"
        onUserMedia={() => setCameraReady(true)}
      />

      <button
        onClick={capture}
        disabled={!cameraReady || captured}
        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        {captured ? "Captured!" : "Capture Selfie"}
      </button>
    </div>
  );
}
