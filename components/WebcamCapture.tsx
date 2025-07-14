'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('Could not capture selfie. Try again.');
      return;
    }

    const quizAnswers = localStorage.getItem('quizAnswers');
    if (!quizAnswers) {
      router.push('/');
      return;
    }

    const answers = JSON.parse(quizAnswers);
    setUploading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, selfie: imageSrc }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Image generation failed.');
      }

      localStorage.setItem('fantasyImage', result.image);
      router.push('/result');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
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
        className="w-full max-w-sm rounded-md mb-4"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={capture}
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
      >
        {uploading ? 'Uploading...' : 'Generate Fantasy Image'}
      </button>
    </div>
  );
}
