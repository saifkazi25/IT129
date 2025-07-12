'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

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

  const handleSubmit = () => {
    if (image) {
      router.push('/result');
    } else {
      alert('Please take a selfie first!');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 bg-white text-black p-4">
      <h1 className="text-3xl font-bold">📸 Take a Selfie</h1>

      {!image ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={320}
          className="rounded-md border"
        />
      ) : (
        <img src={image} alt="Selfie" className="rounded-md border w-80 h-80 object-cover" />
      )}

      <div className="flex gap-4">
        {!image && (
          <button
            onClick={capture}
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Capture Selfie
          </button>
        )}

        {image && (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Generate Image
          </button>
        )}
      </div>
    </main>
  );
}
