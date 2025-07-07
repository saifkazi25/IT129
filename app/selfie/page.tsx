'use client';

import React, { useRef, useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SelfiePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading camera…</div>}>
      <SelfiePage />
    </Suspense>
  );
}

const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

function SelfiePage() {
  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) {
      setError('Webcam not available.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      const answers = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`) ?? '');
      const query = new URLSearchParams({
        img: encodeURIComponent(imageSrc),
        answers: encodeURIComponent(JSON.stringify(answers)),
      });
      router.push(`/result?${query.toString()}`);
    } else {
      setError('Unable to capture image. Please ensure your camera is enabled.');
    }
  }, [router, searchParams]);

  const videoConstraints = {
    facingMode: 'user',
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">📸 Take a Selfie</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!screenshot ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={videoConstraints}
            onUserMedia={() => setIsCameraReady(true)}
          />
          <button
            onClick={handleCapture}
            disabled={!isCameraReady}
            className={`w-full py-2 rounded-xl text-white transition ${
              isCameraReady ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
            }`}
          >
            {isCameraReady ? 'Capture Selfie' : 'Loading Camera…'}
          </button>
        </>
      ) : (
        <>
          <img src={screenshot} alt="Your selfie" className="rounded-xl mb-4" />
          <div className="flex gap-4 w-full">
            <button
              onClick={() => setScreenshot(null)}
              className="flex-1 bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-700"
            >
              Retake
            </button>
            <button
              onClick={handleCapture}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
            >
              Use This
            </button>
          </div>
        </>
      )}
    </main>
  );
}
