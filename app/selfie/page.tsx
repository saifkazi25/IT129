'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import type { WebcamProps } from 'react-webcam';

export default function SelfiePage() {
  const webcamRef = useRef<Webcam | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      localStorage.setItem('selfie', screenshot);
    }
  };

  const handleContinue = () => {
    if (!image) {
      alert('Please take a selfie before continuing.');
      return;
    }
    router.push('/result');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">📸 Capture Your Selfie</h1>

      {!image ? (
        <div className="mb-4">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-md shadow-lg w-full max-w-sm"
          />
          <button
            onClick={capture}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Capture Selfie
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={image}
            alt="Captured selfie"
            className="rounded-md shadow-lg w-full max-w-sm"
          />
          <button
            onClick={() => setImage(null)}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Retake
          </button>
        </div>
      )}

      {image && (
        <button
          onClick={handleContinue}
          disabled={loading}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
        >
          {loading ? 'Processing...' : 'Continue'}
        </button>
      )}
    </main>
  );
}
