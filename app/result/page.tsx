// app/result/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFantasyImage = async () => {
      const quizAnswersRaw = localStorage.getItem('quizAnswers');
      const selfieDataUrl = localStorage.getItem('selfie');

      if (!quizAnswersRaw || !selfieDataUrl) {
        console.error('Missing quiz or selfie data. Redirecting...');
        router.push('/');
        return;
      }

      try {
        const quizAnswers = JSON.parse(quizAnswersRaw);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: quizAnswers,
            selfie: selfieDataUrl,
          }),
        });

        if (!response.ok) {
          console.error('API responded with error', response.status);
          router.push('/');
          return;
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error generating image:', err);
        router.push('/');
      }
    };

    fetchFantasyImage();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <h1 className="text-2xl animate-pulse">🔮 Generating Your Fantasy...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">🌌 Your Infinite Tsukuyomi</h1>
      <img src={imageUrl} alt="Fantasy Result" className="max-w-full max-h-[80vh] rounded-xl shadow-lg" />
      <button
        className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-300"
        onClick={() => router.push('/')}
      >
        🔁 Try Again
      </button>
    </div>
  );
}


