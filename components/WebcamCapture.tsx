"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function WebcamCapture({ onCapture }: { onCapture: (img: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptured(imageSrc);
      onCapture(imageSrc);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded border"
        videoConstraints={{ facingMode: "user" }}
      />
      <button
        onClick={capture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Capture Selfie
      </button>
      {captured && (
        <img src={captured} alt="Captured" className="rounded border mt-4 max-w-xs" />
      )}
    </div>
  );
}


