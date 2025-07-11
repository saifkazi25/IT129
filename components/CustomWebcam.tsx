'use client';

import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

export default function CustomWebcam({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    } else {
      setError('Failed to capture image. Please try again.');
    }
  }, [webcamRef, onCapture]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={videoConstraints}
      />
      <button
        onClick={capture}
        className="px-6 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
      >
        Capture Selfie
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

