'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [finalImage, setFinalImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedAnswers = localStorage.getItem('quizAnswers');
      const storedSelfie = localStorage.getItem('selfie');

      console.log('🧠 Retrieved quizAnswers:', storedAnswers);
      console.log('📷 Retrieved selfie (start):', storedSelfie?.substring(0, 30));

      if (!storedAnswers || !storedSelfie) {
        console.warn('⚠️ Missing quiz or selfie data. Redirecting...');
        router.push('/');
        return;
      }

      try {
        const quizAnswers = JSON.parse(storedAnswers);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizAnswers, selfie: storedSelfie }),
        });

        if (!response.ok) throw new Error('Failed to generate image.');

        const data = await response.json();
        setFinalImage(data.finalImage);
      } catch (err) {
        console.error('❌ Error during image generation:', err);
        setError('Failed to generate fantasy image. Try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">🌀 Your Fantasy World</h1>

      {loading && <p className="text-gray-600">Generating your dream world...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && finalImage && (
        <Image
          src={finalImage}
          alt="Your fantasy world"
          width={600}
          height={600}
          className="rounded-xl shadow-lg"
        />
      )}
    </div>
  );
}


