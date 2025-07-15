"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const handleUserMedia = () => {
    setCameraReady(true);
  };

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        localStorage.setItem("selfie", imageSrc);
        setSelfie(imageSrc);
        setCaptured(true);
        setTimeout(() => router.push("/result"), 1500);
      } else {
        setError("Could not capture image. Please try again.");
      }
    }
  }, [router]);

  useEffect(() => {
    const storedSelfie = localStorage.getItem("selfie");
    if (storedSelfie) {
      setSelfie(storedSelfie);
      setCaptured(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>

      {cameraReady ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded shadow-lg mb-4"
        />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          className="rounded shadow-lg mb-4"
        />
      )}

      <button
        onClick={handleCapture}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
        disabled={!cameraReady || captured}
      >
        {captured ? "✅ Captured!" : "📸 Capture"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
