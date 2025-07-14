'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('mergedImage');
    setImage(storedImage);
  }, []);

  if (!image) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-black">
        <h1 className="text-xl font-bold">Loading your fantasy...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-black">
      <h1 className="text-3xl font-bold">🌌 Behold Your Fantasy World</h1>
      <img src={image} alt="Fantasy" className="max-w-full rounded-lg shadow-xl" />
    </main>
  );
}
