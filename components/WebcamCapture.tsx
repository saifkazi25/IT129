'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic import and cast to 'any' to silence TS issues
const Webcam = dynamic(() => import("react-webcam") as any, { ssr: false });

export default function WebcamCapture({ onCapture }: { onCapture: (image: string) => void }) {
  const webcamRef = useRef<any>(null);
  const [error, setError] = useState("");

  const capture = () => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      } else {
        setError("Unable to capture image.");
      }
    } catch (err) {
      setError("Webcam error.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded border"
        videoConstraints={{ facingMode: "user" }}
      />
      <button
        onClick={capture}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Capture Selfie
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
