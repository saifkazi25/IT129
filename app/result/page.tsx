'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [finalImage, setFinalImage] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const storedQuiz = localStorage.getItem('quizAnswers');
        const storedSelfie = localStorage.getItem('selfie');

        if (!storedQuiz || !storedSelfie) {
          setError('Missing quiz answers or selfie.');
          setLoading(false);
          return;
        }

        const quizAnswers = JSON.parse(storedQuiz);

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: storedSelfie,
            quizAnswers: quizAnswers,
          }),
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || 'Failed to generate image');
        }

        const data = await res.json();
        setFinalImage(data.image);
      } catch (err: any) {
        setError(err.message || 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      {loading && <p className="text-xl font-semibold">⏳ Generating your fantasy image...</p>}
      {error && <p className="text-red-500 font-semibold">⚠️ {error}</p>}
      {finalImage && (
        <div className="mt-6">
          <h1 className="text-2xl font-bold mb-4">🌟 Your Fantasy Image</h1>
          <img
            src={finalImage}
            alt="Fantasy Result"
            className="max-w-full h-auto rounded-2xl shadow-lg"
          />
        </div>
      )}
    </main>
  );
}
