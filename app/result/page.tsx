'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const generateFantasyImage = async () => {
      const quizData = localStorage.getItem('quizAnswers');
      const selfieData = localStorage.getItem('selfie');

      if (!quizData || !selfieData) {
        console.warn('Missing quiz or selfie data. Redirecting to quiz.');
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizAnswers: JSON.parse(quizData),
            selfie: selfieData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image. Please try again.');
        }

        const data = await response.json();
        setImageUrl(data.finalImage);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    generateFantasyImage();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-black bg-white">
        <p className="text-xl font-semibold animate-pulse">✨ Generating your dream world...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 bg-white">
        <p className="text-lg font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">🌌 Your Fantasy Awaits</h1>
      <img
        src={imageUrl}
        alt="Your Fantasy World"
        className="max-w-full max-h-[80vh] rounded-lg shadow-lg border"
      />
      <button
        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        onClick={() => router.push('/')}
      >
        🔁 Try Again
      </button>
    </div>
  );
}



