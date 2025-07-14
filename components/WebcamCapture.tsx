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
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      setError('Could not capture image');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          image: imageSrc,
          answers: quizAnswers,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const { mergedImage } = await response.json();

      // Save result in localStorage and go to result page
      localStorage.setItem('mergedImage', mergedImage);
      router.push('/result');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Capture Your Selfie</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full max-w-sm rounded-lg border"
      />

      <button
        onClick={capture}
        disabled={uploading}
        className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        {uploading ? 'Summoning your fantasy...' : 'Capture & Enter Fantasy'}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
