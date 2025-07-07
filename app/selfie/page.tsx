'use client';

import React, { useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { MutableRefObject } from 'react';

const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

function SelfieComponent() {
  const webcamRef = useRef<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const capture = async () => {
    if (!webcamRef.current) return;
    const shot = webcamRef.current.getScreenshot();
    if (!shot) return;

    setImage(shot);

    const answers = Array.from(searchParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selfie: shot, answers }),
    }).then(r => r.json());

    if (res.url) setImage(res.url);
  };

  return (
    <main className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-xl border mb-4"
        videoConstraints={{ facingMode: 'user' }}
      />
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

export default function SelfiePage() {
  return (
    <Suspense fallback={<div className="p-4">Loading camera...</div>}>
      <SelfieComponent />
    </Suspense>
  );
}
