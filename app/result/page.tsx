'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fantasy = localStorage.getItem('fantasyImage');
    const merged = localStorage.getItem('mergedImage');

    if (fantasy && merged) {
      setFantasyImage(fantasy);
      setMergedImage(merged);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-white text-black">
        <p>Loading your dream...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Infinite Tsukuyomi</h1>

      {fantasyImage && (
        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Generated Fantasy World</h2>
          <img
            src={fantasyImage}
            alt="Fantasy Scene"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      )}

      {mergedImage && (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">You in the Fantasy</h2>
          <img
            src={mergedImage}
            alt="Merged Fantasy"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      )}
    </main>
  );
}
