'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const generateFantasy = async () => {
      const quizAnswers = localStorage.getItem('quizAnswers');
      const selfie = localStorage.getItem('selfie');

      if (!quizAnswers || !selfie) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: JSON.parse(quizAnswers),
            selfie,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to generate image');
        }

        const data = await res.json();
        setImageUrl(data.finalImage); // this is the merged image URL
        setLoading(false);
      } catch (err) {
        console.error('❌ Error generating fantasy image:', err);
        setError('Failed to generate your fantasy image. Please try again.');
        setLoading(false);
      }
    };

    generateFantasy();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <p className="text-xl font-semibold">⏳ Creating your fantasy world...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">🌌 Your Infinite Tsukuyomi Awaits</h1>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Your fantasy image"
          className="max-w-full rounded-lg shadow-lg mb-6"
        />
      )}
      <button
        onClick={() => router.push('/')}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
      >
        🔁 Restart
      </button>
    </div>
  );
}
