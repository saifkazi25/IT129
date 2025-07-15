"use client";

import { useRef, useState, useCallback } from "react";
import Webcam, { Webcam as WebcamType } from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<WebcamType | null>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const handleUserMedia = () => {
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        localStorage.setItem("selfieDataUrl", imageSrc);
        console.log("✅ Selfie saved to localStorage");
        router.push("/result");
      } else {
        setError("Failed to capture image. Please try again.");
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={handleUserMedia}
        className="rounded-md border shadow-md"
      />

      <button
        onClick={capture}
        disabled={!cameraReady}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      >
        Capture & See Result
      </button>
    </div>
  );
}
