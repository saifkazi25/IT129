'use client';

import React, { useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

// ─────────────────────────────────────────────────────────
//  We wrap the actual page in a Suspense boundary so that
//  useSearchParams() works correctly during client rendering
// ─────────────────────────────────────────────────────────
export default function SelfiePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading camera…</div>}>
      <SelfiePage />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────
//  Inner page: handles webcam + selfie capture
// ─────────────────────────────────────────────────────────
function SelfiePage() {
  // Dynamically import react-webcam only on the client
  const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const searchParams = useSearchParams();   // answers from the quiz
  const router = useRouter();               // for navigation

  // Capture image from webcam
  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    // Collect quiz answers (q0 … q6) from the URL
    const answers = Array.from({ length: 7 }, (_, i) =>
      searchParams.get(`q${i}`) ?? ''
    );

    // Build query string for /result page
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
            onClick={handleC
