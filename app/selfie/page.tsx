'use client';

import React, { useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SelfiePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading camera…</div>}>
      <SelfiePage />
    </Suspense>
  );
}

function SelfiePage() {
  const Webcam = dynamic(() => import('react-webcam'), { ssr: false });
  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const answers = Array.from({ length: 7 }, (_, i) =>
      searchParams.get(`q${i}`) ?? ''
    );

    const query = new URLSearchParams({
      img: encodeURIComponent(imageSrc),
      answers: encodeURIComponent(JSON.stringify(answers)),
    });

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
            onClick={() => {
              const shot = webcamRef.current?.getScreenshot();
              if (shot) setScreenshot(shot);
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={screenshot} alt="Your selfie" className="rounded-xl mb-4" />
          <div className="flex gap-4">
            <button
              onClick={() => setScreenshot(null)}
              className="flex-1 bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700 transition"
            >
              Retake
            </button>
            <button
              onClick={handleCapture}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Use This
            </button>
          </div>
        </>
      )}
    </main>
  );
}
