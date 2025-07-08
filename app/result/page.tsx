'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selfie = searchParams.get('selfie');
  const description = searchParams.get('description');

  useEffect(() => {
    if (!selfie || !description) {
      setError('Missing data');
      setLoading(false);
      return;
    }

    const generateImage = async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selfie, description }),
        });
        const data = await res.json();

        if (data.image) {
          setImageUrl(data.image);
        } else {
          setError(data.error || 'Something went wrong');
        }
      } catch (err) {
        setError('API call failed');
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, [selfie, description]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {loading && <p className="text-lg">✨ Creating your fantasy... Please wait.</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {imageUrl && (
        <>
          <h1 className="text-2xl font-bold mb-4">🌌 Welcome to Your Dream World</h1>
          <img src={imageUrl} alt="Generated fantasy" className="rounded-xl max-w-full shadow-lg" />
        </>
      )}
    </div>
  );
}
