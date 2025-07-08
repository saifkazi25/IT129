'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ResultDisplay from '@/components/ResultDisplay';

export default function ResultContent() {
  const searchParams = useSearchParams();
  const selfie = searchParams.get('selfie');
  const answers = searchParams.get('answers');

  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateImage() {
      if (!selfie || !answers) return;
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          body: JSON.stringify({ selfie, answers }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setImage(data.image);
      } catch (err) {
        console.error('Failed to generate image', err);
      } finally {
        setLoading(false);
      }
    }
    generateImage();
  }, [selfie, answers]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy Image</h1>
      {loading && <p>Generating your dream world… please wait.</p>}
      {!loading && image && <ResultDisplay image={image} />}
    </>
  );
}
