'use client';

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const capture = async () => {
    const quizData = localStorage.getItem('quizData');
    const selfie = webcamRef.current?.getScreenshot();

    if (!quizData || !selfie) {
      console.log('❌ Missing quizData or selfie');
      setError('Missing quiz or selfie. Please retake.');
      return;
    }

    try {
      setUploading(true);

      // Save both to localStorage (again just in case)
      localStorage.setItem('selfie', selfie);

      console.log('📦 Sending to /api/generate:', { quizData: JSON.parse(quizData), selfie });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizData: JSON.parse(quizData),
          selfie: selfie,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('resultImage', data.mergedImageUrl);
        console.log('✅ Success, navigating to result...');
        router.push('/result');
      } else {
        console.error('❌ API error:', data);
        setError(data.error || 'Failed to generate image.');
      }
    } catch (err: any) {
      console.error('❌ Error submitting to backend:', err);
      setError('Something went wrong.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg w-full max-w-md"
      />
      <button
        onClick={capture}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Use This Selfie'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
