'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import react-webcam without SSR
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

export default function SelfiePage() {
  const webcamRef = useRef<any>(null);
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        // You could also POST this to your backend here
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>

      <Suspense fallback={<p>Loading camera...</p>}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="rounded-xl border mb-4"
          videoConstraints={{
            facingMode: 'user',
          }}
        />
      </Suspense>

      <button
        onClick={capture}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Capture
      </button>

      {image && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Preview:</h2>
          <img src={image} alt="Captured selfie" className="rounded-xl border" />
        </div>
      )}
    </main>
  );
}
