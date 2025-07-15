"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const [captured, setCaptured] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [selfie, setSelfie] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (!cameraReady) {
      setError("Camera not ready yet");
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("📸 imageSrc =", imageSrc?.substring(0, 100));

    if (!imageSrc) {
      setError("Failed to capture selfie.");
      return;
    }

    localStorage.setItem("selfie", imageSrc);
    console.log("✅ Selfie saved to localStorage");
    setSelfie(imageSrc);
    setCaptured(true);
  }, [cameraReady]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">📸 Selfie Test</h1>

      {!captured && (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            width={640}
            height={480}
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
            onUserMedia={() => {
              console.log("🎥 Webcam ready");
              setCameraReady(true);
            }}
            onUserMediaError={(err) => {
              console.error("❌ Webcam error:", err);
              setError("Camera access denied or unavailable.");
            }}
            className="rounded shadow-lg"
          />
          <button
            onClick={capture}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
          >
            Capture
          </button>
        </>
      )}

      {captured && selfie && (
        <>
          <img src={selfie} className="mt-4 rounded shadow" alt="Your Selfie" />
          <p className="text-green-600 font-medium mt-2">✅ Selfie Captured!</p>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
