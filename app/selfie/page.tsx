'use client';

import React, { useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import wrapped webcam
const Webcam = dynamic(() => import('../../components/CustomWebcam'), {
  ssr: false,
});

export default function SelfiePage() {
  const webcamRef = useRef<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        // Here you can handle API logic
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>

      <Suspense fallback={<p>Loading camera...</p>}>
        <Webcam ref={webcamRef} />
      </Suspense>

      <button
        onClick={capture}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
