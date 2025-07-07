'use client';

import React, { useRef, useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import type { WebcamProps } from 'react-webcam';

const Webcam = dynamic<WebcamProps>(() => import('react-webcam'), { ssr: false });

function SelfiePageContent() {
  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setScreenshot(imageSrc);

      const query = new URLSearchParams();
      for (let i = 0; i <= 6; i++) {
        query.append(`q${i}`, searchParams.get(`q${i}`) || '');
      }
      query.append('selfie', encodeURIComponent(imageSrc));

      router.push(`/result?${query.toString()}`);
    }
  }, [searchParams, router]);

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
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={screenshot} alt="Captured selfie" className="rounded-xl border mb-4" />
          <p>Processing your fantasy...</p>
        </>
      )}
    </main>
  );
}

export default function SelfiePage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <SelfiePageContent />
    </Suspense>
  );
}
