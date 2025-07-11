'use client';

import Webcam from 'react-webcam';
import { useCallback, useRef, useState } from 'react';

interface CustomWebcamProps {
  onCapture: (dataUrl: string) => void;
}

export default function CustomWebcam({ onCapture }: CustomWebcamProps) {
  const webcamRef = useRef<any>(null); // Temporarily use 'any' to fix the typing issue
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      } else {
        setError('Unable to capture image.');
      }
    }
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        className="rounded border"
      />
      <button
        onClick={capture}
        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Capture Selfie
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
