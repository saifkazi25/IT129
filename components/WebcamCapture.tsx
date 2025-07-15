"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
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
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        localStorage.setItem("selfie", imageSrc); // ✅ SAVE SELFIE
        setSelfie(imageSrc);
        setCaptured(true);
        router.push("/result"); // ✅ Go to result
      } else {
        setError("Could not capture image. Try again.");
      }
    }
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">📸 Capture Your Selfie</h2>

      {!captured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={() => console.log("Webcam ready")}
            className="rounded-lg"
          />
          <button
            onClick={capture}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={selfie!} alt="Captured selfie" className="rounded-lg mb-4" />
          <p className="text-green-600 font-medium">Selfie captured! Redirecting...</p>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
