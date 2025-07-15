"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();

  const [cameraReady, setCameraReady] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState("");
  const [selfie, setSelfie] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (!cameraReady) {
      console.warn("⏳ Webcam not ready yet.");
      setError("Webcam is not ready yet. Please wait a moment.");
      return;
    }

    const imageSrc = webcamRef.current?.getScreenshot();

    console.log("📸 Attempting to capture selfie...");
    if (!imageSrc) {
      console.error("❌ getScreenshot() returned null");
      setError("Could not capture selfie. Please try again.");
      return;
    }

    console.log("✅ Screenshot captured:", imageSrc.substring(0, 100));

    try {
      localStorage.setItem("selfie", imageSrc);
      console.log("✅ Selfie saved to localStorage");

      setSelfie(imageSrc);
      setCaptured(true);

      setTimeout(() => {
        console.log("➡️ Navigating to /result");
        router.push("/result");
      }, 500);
    } catch (e) {
      console.error("❌ Failed to save selfie to localStorage:", e);
      setError("Failed to save selfie. Please try again.");
    }
  }, [cameraReady, router]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h2>

      {!captured ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={1}
            width={640}
            height={480}
            videoConstraints={videoConstraints}
            onUserMedia={() => {
              console.log("🎥 Webcam ready");
              setCameraReady(true);
            }}
            onUserMediaError={(err) => {
              console.error("❌ Webcam error:", err);
              setError("Unable to access webcam. Please allow camera access.");
            }}
            className="rounded shadow-lg"
          />
          <button
            onClick={capture}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={selfie!} alt="Captured selfie" className="rounded-lg mb-4 max-w-sm" />
          <p className="text-green-600 font-medium">Captured! Redirecting...</p>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
