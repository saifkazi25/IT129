"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // ✅ FIXED typing
  const router = useRouter();
  const [captured, setCaptured] = useState(false);
  const [error, setError] = useState("");
  const [selfie, setSelfie] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("📸 imageSrc captured:", imageSrc?.substring(0, 100)); // debug log

    if (imageSrc) {
      localStorage.setItem("selfie", imageSrc);
      console.log("✅ Selfie saved to localStorage");

      setSelfie(imageSrc);
      setCaptured(true);

      setTimeout(() => {
        console.log("➡️ Navigating to /result");
        router.push("/result");
      }, 500);
    } else {
      console.error("❌ Failed to capture selfie — imageSrc is null");
      setError("Failed to capture image. Please try again.");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h2>

      {!captured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={() => console.log("🎥 Webcam ready")}
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
          <img src={selfie!} alt="Your Selfie" className="rounded-lg mb-4 max-w-sm" />
          <p className="text-green-600 font-medium">Captured! Heading to /result...</p>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
