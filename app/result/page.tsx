'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateFantasyImage = async () => {
      const answers = localStorage.getItem('quizAnswers');
      const selfie = localStorage.getItem('selfie');

      if (!answers || !selfie) {
        setError('Missing quiz answers or selfie.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: JSON.parse(answers),
            selfie,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong.');
        }

        setFantasyImage(data.output);
      } catch (err: any) {
        console.error('Error generating fantasy image:', err);
        setError(err.message || 'Failed to generate image.');
      } finally {
        setLoading(false);
      }
    };

    generateFantasyImage();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🌌 Your Fantasy World</h1>

      {loading && <p className="text-lg">Generating your fantasy image...</p>}

      {error && (
        <p className="text-red-600 font-semibold text-center">{error}</p>
      )}

      {fantasyImage && (
        <img
          src={fantasyImage}
          alt="Fantasy result"
          className="rounded-lg shadow-lg max-w-full max-h-[80vh]"
        />
      )}
    </main>
  );
}
