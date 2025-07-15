'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleCaptureAndGenerate = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setError('Could not capture selfie. Please try again.');
      return;
    }

    const quizAnswersRaw = localStorage.getItem('quizAnswers');
    if (!quizAnswersRaw) {
      setError('Missing quiz answers. Please complete the quiz again.');
      return;
    }

    const quizAnswers = JSON.parse(quizAnswersRaw);
    const selfie = imageSrc;

    setUploading(true);

    try {
      console.log('Sending to /api/generate:', { quizAnswers, selfie: selfie.slice(0, 100) });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizAnswers, selfie }),
      });

      const data = await response.json();

      if (response.ok && data.image) {
        localStorage.setItem('fantasyImage', data.image);
        router.push('/result');
      } else {
        console.error('API error:', data.error);
        setError('Failed to generate fantasy image.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-md mb-4"
        videoConstraints={{ facingMode: 'user' }}
      />
      <button
        onClick={handleCaptureAndGenerate}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={uploading}
      >
        {uploading ? 'Generating...' : 'Capture & Generate'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
