"use client";

import React, { useRef, useState, useEffect } from "react";
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

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      console.error("❌ Failed to capture selfie");
      setError("Failed to capture image. Please try again.");
      return;
    }

    console.log("✅ imageSrc:", imageSrc.slice(0, 100)); // log first part only
    localStorage.setItem("selfie", imageSrc);
    setSelfie(imageSrc);
    setCaptured(true);

    // Wait a bit to ensure it's written to localStorage
    setTimeout(() => {
      router.push("/result");
    }, 300);
  };

  useEffect(() => {
    const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
    console.log("📦 Loaded quizAnswers in selfie page:", quizAnswers);
    if (!quizAnswers || quizAnswers.length !== 7) {
      setError("Missing quiz answers. Please go back.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">📸 Capture Your Selfie</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!captured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-md mb-4"
          />
          <button
            onClick={capture}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <p className="mb-4">✅ Selfie captured. Redirecting to your fantasy...</p>
          {selfie && (
            <img
              src={selfie}
              alt="Captured Selfie"
              className="rounded-lg shadow-md max-w-xs"
            />
          )}
        </>
      )}
    </div>
  );
}
