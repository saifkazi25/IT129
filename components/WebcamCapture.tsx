"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState("");

  const capture = () => {
    const image = webcamRef.current?.getScreenshot();
    if (!image) {
      console.error("❌ getScreenshot returned null");
      setError("Failed to capture selfie.");
    } else {
      console.log("✅ imageSrc:", image.substring(0, 100));
      setImageSrc(image);
      localStorage.setItem("selfie", image);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-4">🎥 Manual Webcam Test</h2>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        screenshotQuality={1}
        width={640}
        height={480}
        videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
        className="rounded shadow"
      />

      <button
        onClick={capture}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Capture
      </button>

      {imageSrc && (
        <>
          <p className="text-green-600 mt-4">✅ Selfie Captured!</p>
          <img src={imageSrc} alt="Captured" className="mt-4 rounded shadow" />
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
