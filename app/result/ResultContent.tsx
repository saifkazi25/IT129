'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultContent() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!searchParams) return;

      const qParams = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`));
      const selfie = searchParams.get('image');

      if (qParams.some(q => !q) || !selfie) return;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: qParams, image: selfie }),
      });

      const data = await res.json();
      setImageUrl(data.image);
    };

    fetchImage();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl mb-4">🌀 Generating your dream world...</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="Your fantasy" className="max-w-full rounded shadow-md" />
      ) : (
        <p>🧠 Please wait while we generate your image...</p>
      )}
    </div>
  );
}
