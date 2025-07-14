'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFantasyImage = async () => {
      try {
        const quizDataRaw = localStorage.getItem('quizData');
        const selfieDataUrl = localStorage.getItem('selfieDataUrl');

        if (!quizDataRaw || !selfieDataUrl) {
          console.warn('Missing quiz or selfie data. Redirecting...');
          router.push('/');
          return;
        }

        const quizData = JSON.parse(quizDataRaw);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: quizData,
            selfie: selfieDataUrl,
          }),
        });

        const result = await response.json();

        if (result.error) {
          setError(result.error);
        } else {
          setFinalImage(result.output);
        }
      } catch (err: any) {
        setError('Failed to generate image.');
      } finally {
        setLoading(false);
      }
    };

    fetchFantasyImage();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl">🧠 Loading your fantasy...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!finalImage) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p>No image found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy Awaits</h1>
      <Image
        src={finalImage}
        alt="Your Fantasy World"
        width={512}
        height={512}
        className="rounded-xl shadow-lg"
      />
    </div>
  );
}

