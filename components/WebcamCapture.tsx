'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';

type Props = {
  onCapture: (image: string) => void;
};

// Dynamically import the Webcam component with `any` to suppress type errors
const Webcam = dynamic<any>(() => import("react-webcam"), { ssr: false });

export default function WebcamCapture({ onCapture }: Props) {
  const webcamRef = useRef<any>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Capture Selfie 📸
      </button>
    </div>
  );
}

