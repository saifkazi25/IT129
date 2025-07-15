'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const generateImage = async () => {
      try {
        const quizAnswersRaw = localStorage.getItem('quizAnswers');
        const selfie = localStorage.getItem('selfie');

        if (!quizAnswersRaw || !selfie) {
          console.warn('Missing quiz or selfie data. Redirecting...');
          router.push('/');
          return;
        }

        const quizAnswers = JSON.parse(quizAnswersRaw);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizAnswers, selfie }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to generate image');
        }

        const data = await response.json();
        setImageUrl(data.image);
      } catch (err: any) {
        console.error('Image generation failed:', err.message);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    // Delay a bit to ensure localStorage is populated
    setTimeout(generateImage, 200);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🌌 Your Fantasy World Awaits</h1>

      {loading && <p className="text-xl">✨ Generating your dream image...</p>}

      {error && (
        <p className="text-red-500 text-center text-lg mt-4">
          ❌ {error}
        </p>
      )}

      {!loading && imageUrl && (
        <img
          src={imageUrl}
          alt="Your fantasy world"
          className="mt-6 rounded-xl shadow-lg max-w-full w-[500px]"
        />
      )}
    </div>
  );
}
