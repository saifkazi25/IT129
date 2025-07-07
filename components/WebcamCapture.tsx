'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// Dynamically import react-webcam and cast to “any” so TS stops complaining
const Webcam = dynamic<any>(() => import('react-webcam'), { ssr: false });

type Props = {
  onCapture: (img: string) => void;
};

export default function WebcamCapture({ onCapture }: Props) {
  // Use 'any' for the ref to avoid TS namespace issues
  const webcamRef = useRef<any>(null);      // ← change is here
  const [captured, setCaptured] = useState<string | null>(null);

  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setCaptured(img);
      onCapture(img);          // forward to parent (or API) if needed
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded border"
        videoConstraints={{ facingMode: 'user' }}
      />

      <button
        onClick={capture}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Capture Selfie 📸
      </button>

      {captured && (
        <img
          src={captured}
          alt="Captured selfie"
          className="max-w-xs rounded border mt-4"
        />
      )}
    </div>
  );
}
