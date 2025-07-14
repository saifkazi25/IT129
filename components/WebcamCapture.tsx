'use client';

import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // ✅ Fix: use `any` instead of `Webcam` type
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: 'user',
  };

  const handleCapture = useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError('Could not capture selfie.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizAnswers,
          selfie: imageSrc,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');

      const data = await res.json();

      // ✅ Store merged image in localStorage
      localStorage.setItem('mergedImage', data.mergedImage);

      // ✅ Redirect to result
      router.push('/result');
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 Capture Your Selfie</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={480}
          height={480}
          videoConstraints={videoConstraints}
        />
      </div>

      <button
        onClick={handleCapture}
        disabled={uploading}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-2xl shadow-md"
      >
        {uploading ? 'Generating Your Fantasy...' : 'Capture & Enter Fantasy'}
      </button>
    </main>
  );
}
