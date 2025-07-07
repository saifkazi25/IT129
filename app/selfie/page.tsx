'use client';

import React, { Suspense, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import CustomWebcam from '@/components/CustomWebcam';

export default function SelfiePage() {
  return (
    <main className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>
      <Suspense fallback={<p>Loading camera...</p>}>
        <SelfieContent />
      </Suspense>
    </main>
  );
}

function SelfieContent() {
  const webcamRef = useRef<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        // TODO: send screenshot + quiz data from searchParams to backend
      }
    }
  };

  return (
    <>
      <CustomWebcam ref={webcamRef} />
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
    </>
  );
}
