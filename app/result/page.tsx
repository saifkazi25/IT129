'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const quizDataString = localStorage.getItem('quizData');
        const selfieDataUrl = localStorage.getItem('selfie');

        if (!quizDataString || !selfieDataUrl) {
          console.warn('Missing quiz answers or selfie.');
          router.replace('/');
          return;
        }

        const quizData = JSON.parse(quizDataString);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizData,
            selfie: selfieDataUrl,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Generation failed: ${errorText}`);
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (err: any) {
        console.error('Image generation error:', err);
        setError('Failed to generate image. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        <h1 className="text-2xl font-bold animate-pulse">🧠 Loading your fantasy...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Error</h1>
        <p>{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go back to Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">🌌 Your Fantasy Awaits</h1>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Your fantasy"
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      ) : (
        <p>Image not available.</p>
      )}
    </div>
  );
}
