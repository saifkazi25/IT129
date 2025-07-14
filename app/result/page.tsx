'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mergedImage = localStorage.getItem('mergedImage');
    if (mergedImage) {
      setFinalImageUrl(mergedImage);
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-white">
        Loading your fantasy...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🌌 Behold Your Infinite Tsukuyomi</h1>
      {finalImageUrl ? (
        <img
          src={finalImageUrl}
          alt="Final Fantasy Merge"
          className="max-w-full rounded-2xl shadow-lg"
        />
      ) : (
        <p className="text-lg text-red-500 mt-4">Oops! No image found. Please try again.</p>
      )}
    </main>
  );
}
