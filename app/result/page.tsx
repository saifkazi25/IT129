'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const quizAnswers = localStorage.getItem('quizAnswers');
    const selfie = localStorage.getItem('selfie');

    if (!quizAnswers || !selfie) {
      console.warn('Missing quiz or selfie data. Redirecting to quiz.');
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: JSON.parse(quizAnswers),
            selfie,
          }),
        });

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        setImageUrl(data.finalImage);
      } catch (err) {
        console.error('Error generating image:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) return <div className="p-4">⏳ Generating your fantasy image...</div>;

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">🌌 Your Fantasy Image</h1>
      {imageUrl ? (
        <img src={imageUrl} alt="Fantasy Result" className="rounded-lg shadow-md max-w-full" />
      ) : (
        <p className="text-red-500">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
