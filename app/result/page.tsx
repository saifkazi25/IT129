'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMergedImage = async () => {
      try {
        const storedQuizAnswers = localStorage.getItem('quizAnswers');
        const storedSelfieUrl = localStorage.getItem('selfieDataUrl');

        if (!storedQuizAnswers || !storedSelfieUrl) {
          setError('Missing quiz answers or selfie');
          setIsLoading(false);
          return;
        }

        const quizAnswers = JSON.parse(storedQuizAnswers);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizAnswers,
            selfieDataUrl: storedSelfieUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image');
        }

        const data = await response.json();
        if (data.finalImage) {
          setMergedImageUrl(data.finalImage);
        } else {
          setError('Image not generated');
        }
      } catch (err: any) {
        console.error('⚠️ Error generating image:', err);
        setError('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMergedImage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
      <h1 className="text-3xl mb-6 font-bold text-center">Your Infinite Tsukuyomi</h1>

      {isLoading && <p>Loading your fantasy image...</p>}

      {!isLoading && mergedImageUrl && (
        <img
          src={mergedImageUrl}
          alt="Your fantasy merged image"
          className="max-w-full rounded-lg shadow-lg"
        />
      )}

      {!isLoading && !mergedImageUrl && error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
    </div>
  );
}
