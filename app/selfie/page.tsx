'use client';

import React, { useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

// ✅ Correct dynamic import
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

function SelfiePageContent() {
  const webcamRef = useRef(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      setScreenshot(imageSrc);
    }
  }, []);

  const handleContinue = () => {
    if (!screenshot) return;
    const query = new URLSearchParams(searchParams.toString());
    query.set('selfie', encodeURIComponent(screenshot));
    router.push(`/result?${query.toString()}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">📸 Take a Selfie</h1>

      {!screenshot ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={handleCapture}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl"
          >
            Capture
          </button>
        </>
      ) : (
        <>
          <img src={screenshot} alt="Your selfie" className="rounded-xl mb-4" />
          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-green-600 text-white rounded-xl"
          >
            Continue
          </button>
        </>
      )}
    </main>
  );
}

export default function SelfiePage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <SelfiePageContent />
    </React.Suspense>
  );
}
