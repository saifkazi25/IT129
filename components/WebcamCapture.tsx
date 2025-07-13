'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('Failed to capture image. Please try again.');
      return;
    }

    localStorage.setItem('selfie', imageSrc);
    router.push('/result');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white text-black">
      <h1 className="text-2xl font-bold">📸 Take Your Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        videoConstraints={{ facingMode: 'user' }}
        className="rounded-xl shadow-md"
      />
      <button
        onClick={capture}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Capture Selfie
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
