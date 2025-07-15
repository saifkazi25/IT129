'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const generateImage = async () => {
      try {
        const quizAnswers = localStorage.getItem('quizAnswers');
        const selfie = localStorage.getItem('selfie');

        console.log('📦 Retrieved quizAnswers:', quizAnswers);
        console.log('📸 Retrieved selfie (start):', selfie?.substring(0, 30));

        if (!quizAnswers || !selfie) {
          console.warn('⚠️ Missing quiz or selfie data. Redirecting...');
          router.push('/');
          return;
        }

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizAnswers: JSON.parse(quizAnswers),
            selfie,
          }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || 'Image generation failed');
        }

        const data = await response.json();
        setImageUrl(data.image);
        setLoading(false);
      } catch (err: any) {
        console.error('❌ Error generating image:', err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    generateImage();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      {loading && <p className="text-xl font-semibold">⏳ Generating your fantasy world...</p>}

      {!loading && error && (
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && imageUrl && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🌟 Welcome to Your Fantasy World</h1>
          <img src={imageUrl} alt="Your fantasy world" className="rounded shadow-lg max-w-full" />
        </div>
      )}
    </div>
  );
}

