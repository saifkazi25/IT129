'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFinalImage = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
        const selfieUrl = localStorage.getItem('selfieUrl');

        if (!quizAnswers.length || !selfieUrl) {
          setError('Missing quiz answers or selfie. Please go back and try again.');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();

        if (data && data.finalImageUrl) {
          setMergedImageUrl(data.finalImageUrl);
        } else {
          setError('Failed to generate image. Please try again.');
        }
      } catch (err) {
        console.error('Error generating image:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinalImage();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">🌌 Your Infinite Tsukuyomi</h1>

      {loading && <p className="text-lg animate-pulse">Generating your fantasy image...</p>}

      {!loading && error && (
        <p className="text-red-600 text-center">{error}</p>
      )}

      {!loading && mergedImageUrl && (
        <img
          src={mergedImageUrl}
          alt="Your Infinite Tsukuyomi"
          className="max-w-full rounded-lg shadow-lg mt-6"
        />
      )}
    </main>
  );
}
