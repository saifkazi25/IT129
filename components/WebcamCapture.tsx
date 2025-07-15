"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
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
    if (!imageSrc) {
      setError("Failed to capture image.");
      return;
    }

    console.log("✅ Captured selfie image");
    setSelfie(imageSrc);
    localStorage.setItem("selfie", imageSrc);
    setCaptured(true);

    // ✅ Delay redirect to ensure storage is set
    setTimeout(() => {
      router.push("/result");
    }, 500);
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>
      {error && <p className="text-red-500">{error}</p>}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-md mb-4"
      />
      <button
        onClick={capture}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        {captured ? "Retake Selfie" : "Capture Selfie"}
      </button>
    </div>
  );
}
