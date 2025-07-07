'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function WebcamCapture({ onCapture }: { onCapture: (img: string) => void }) {
  const webcamRef = useRef<any>(null); // ✅ FIXED: replaced <Webcam> with <any>
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
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded border"
        videoConstraints={{ facingMode: 'user' }}
      />
      <button
        onClick={capture}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Capture
      </button>
      {captured && <img src={captured} alt="Captured" className="mt-4 rounded shadow" />}
    </div>
  );
}
