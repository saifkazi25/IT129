'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateFantasyImage = async () => {
      const quiz = localStorage.getItem('quiz');
      const selfie = localStorage.getItem('selfie');

      if (!quiz || !selfie) {
        console.warn('Missing quiz or selfie data. Redirecting...');
        router.push('/');
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quiz: JSON.parse(quiz), selfie }),
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody.error || 'Image generation failed.');
        }

        const data = await response.json();
        setFantasyImage(data.image);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    generateFantasyImage();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Fantasy World Awaits</h1>

      {loading && <p className="text-lg">✨ Generating your fantasy...</p>}

      {!loading && error && (
        <p className="text-red-500 text-center text-lg">{error}</p>
      )}

      {!loading && fantasyImage && (
        <img
          src={fantasyImage}
          alt="Your fantasy world"
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      )}

      {!loading && !fantasyImage && !error && (
        <p className="text-gray-500">Image not available.</p>
      )}
    </div>
  );
}
