'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const quizAnswers = localStorage.getItem('quizAnswers');
    const selfieImage = localStorage.getItem('selfieImage');

    if (!quizAnswers || !selfieImage) {
      setError('Missing quiz answers or selfie image.');
      setLoading(false);
      return;
    }

    const fetchImage = async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: JSON.parse(quizAnswers),
            selfie: selfieImage,
          }),
        });

        const data = await res.json();
        setImage(data.finalImage);
      } catch (err) {
        setError('Failed to generate image.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-white text-black">
      <h1 className="text-3xl font-bold">🧠 Your Fantasy Self</h1>

      {loading && <p className="text-purple-600">Generating your dream image...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {image && (
        <img
          src={image}
          alt="Fantasy Result"
          className="max-w-full max-h-[80vh] border rounded shadow-lg"
        />
      )}
    </main>
  );
}





