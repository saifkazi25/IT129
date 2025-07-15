'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import type { MutableRefObject } from 'react';

export default function WebcamCapture() {
  const webcamRef: MutableRefObject<Webcam | null> = useRef(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const captureAndSubmit = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setError('Could not capture image.');
      return;
    }

    const storedQuiz = localStorage.getItem('quizAnswers');
    if (!storedQuiz) {
      setError('Missing quiz answers.');
      router.push('/');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz: JSON.parse(storedQuiz),
          selfie: imageSrc,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      if (!data.finalImageUrl) {
        throw new Error('No image returned');
      }

      localStorage.setItem('finalImageUrl', data.finalImageUrl);
      router.push('/result');
    } catch (err: any) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full max-w-xs rounded-md border border-white"
      />

      <button
        onClick={captureAndSubmit}
        disabled={uploading}
        className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Generate My Fantasy'}
      </button>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
    </div>
  );
}
