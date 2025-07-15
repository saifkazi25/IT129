"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null); // ✅ Safe TS ref

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

  useEffect(() => {
    const storedSelfie = localStorage.getItem("selfieDataUrl");
    if (storedSelfie) {
      setSelfie(storedSelfie);
      setCaptured(true);
    }
  }, []);

  const handleUserMedia = () => {
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      console.error("❌ Webcam ref is null");
      setError("Webcam not ready. Please try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Failed to capture image. Please try again.");
      return;
    }

    setSelfie(imageSrc);
    localStorage.setItem("selfieDataUrl", imageSrc);
    setCaptured(true);

    console.log("✅ Selfie captured and saved");

    setTimeout(() => {
      router.push("/result");
    }, 500);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl mb-4 font-bold">Step 2: Capture Your Selfie</h1>

      {!captured ? (
        <>
          <div className="mb-4">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              className="rounded-lg shadow-md"
            />
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <button
            onClick={capture}
            disabled={!cameraReady}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              cameraReady
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            {cameraReady ? "Capture Selfie" : "Camera Loading..."}
          </button>
        </>
      ) : (
        <>
          <img
            src={selfie as string}
            alt="Captured selfie"
            className="w-64 h-auto rounded-lg shadow-md mb-4"
          />
          <p className="text-green-400 font-semibold">✅ Selfie Saved</p>
        </>
      )}
    </div>
  );
}
