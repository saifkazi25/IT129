"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // ✅ Use `any` to avoid TS build error
  const router = useRouter();
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    console.log("📸 imageSrc captured:", imageSrc?.slice(0, 80));

    if (imageSrc) {
      localStorage.setItem("selfie", imageSrc);
      setSelfie(imageSrc);
      setCaptured(true);

      setTimeout(() => {
        router.push("/result");
      }, 500);
    } else {
      setError("❌ Failed to capture image.");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {error && <p className="text-red-500">{error}</p>}

      {!captured ? (
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
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={selfie!}
            alt="Captured Selfie"
            className="rounded-lg mb-4 max-w-sm"
          />
          <p className="text-green-600 font-medium">Captured! Redirecting...</p>
        </>
      )}
    </div>
  );
}
