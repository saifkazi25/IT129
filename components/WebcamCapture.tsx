'use client';

import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // Fix: Avoid TS namespace error
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setError('Failed to capture selfie. Please try again.');
      return;
    }

    const quizAnswersRaw = localStorage.getItem('quizAnswers');
    if (!quizAnswersRaw) {
      setError('Missing quiz answers. Please retake the quiz.');
      return router.push('/');
    }

    try {
      setUploading(true);
      setError('');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizAnswers: JSON.parse(quizAnswersRaw),
          selfie: imageSrc,
        }),
      });

      const data = await response.json();

      if (data.finalImageUrl) {
        localStorage.setItem('mergedImage', data.finalImageUrl);
        router.push('/result');
      } else {
        setError('Image generation failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Self
