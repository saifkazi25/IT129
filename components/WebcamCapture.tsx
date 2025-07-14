'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  // Correct ref typing for a React component instance
  const webcamRef = useRef<React.ElementRef<typeof Webcam>>(null);

  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCapture = async () => {
    // cast to any so TS knows getScreenshot exists
    const selfie = (webcamRef.current as any)?.getScreenshot();

    if (!selfie) {
      setError('Could not capture selfie.');
      return;
    }

    const answersRaw = localStorage.getItem('quizAnswers');
    if (!answersRaw) {
      router.push('/');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizAnswers: JSON.parse(answersRaw),
          image: selfie,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const { mergedImage } = await res.json();   // ✅ await fixed

      // store for /result page
      localStorage.setItem('mergedImage', mergedImage);
      router.push('/result');
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center gap-4 min-h-screen p-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user', width: 720, height: 720 }}
        className="rounded-xl shadow"
      />

      <button
        onClick={handleCapture}
        disabled={busy}
        className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        {busy ? 'Generating…' : 'Capture & Generate'}
      </button>

      {error && <p className="text-red-600">{error}</p>}
    </main>
  );
}
