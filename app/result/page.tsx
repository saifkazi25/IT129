'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const generateImage = async () => {
      try {
        const storedAnswers = localStorage.getItem('quizAnswers');
        const storedSelfieUrl = localStorage.getItem('cloudinarySelfieUrl');

        if (!storedAnswers || !storedSelfieUrl) {
          console.error('Missing quiz answers or selfie URL.');
          router.push('/');
          return;
        }

        const quizAnswers = JSON.parse(storedAnswers);
        const selfieUrl = storedSelfieUrl;

        console.log('📦 Sending to /api/generate:', {
          quizAnswers,
          selfieUrl,
        });

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate image: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('🖼 Generated image result:', data);

        setImageUrl(data.imageUrl);
        setLoading(false);
      } catch (err: any) {
        console.error('🔥 Error generating image:', err);
        setError('Failed to generate your fantasy image. Please try again.');
        setLoading(false);
      }
    };

    generateImage();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        🌌 Generating your Infinite Tsukuyomi fantasy...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <p>{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-white text-black rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl mb-4">🌌 Your Fantasy World Awaits</h1>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Your Fantasy World"
          className="w-full max-w-2xl rounded shadow-lg border"
        />
      )}
      <button
        onClick={() => router.push('/')}
        className="mt-6 px-4 py-2 bg-white text-black rounded hover:bg-gray-300"
      >
        Create Another
      </button>
    </div>
  );
}
