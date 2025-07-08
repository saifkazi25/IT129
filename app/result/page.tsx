'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResultDisplay from '@/components/ResultDisplay';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selfie = searchParams.get('selfie');
    const answers = searchParams.get('answers');

    console.log('📸 Selfie Param:', selfie);
    console.log('🧠 Answers Param:', answers);

    const fetchImage = async () => {
      if (!selfie || !answers) return;

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selfie, answers }),
        });

        const data = await response.json();
        console.log('🖼️ API response:', data);

        setImage(data.image);
      } catch (error) {
        console.error('❌ Failed to generate image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy Image</h1>
      {loading && <p>Generating your dream world… please wait.</p>}
      {!loading && image && <ResultDisplay image={image} />}
      {!loading && !image && (
        <p className="text-red-600 font-medium">⚠️ Failed to generate image. Please try again.</p>
      )}
    </main>
  );
}

