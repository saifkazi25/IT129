'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [finalImage, setFinalImage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('fantasyImage');
    if (stored) setFinalImage(stored);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">✨ Your Infinite Tsukuyomi ✨</h1>
      {finalImage ? (
        <img src={finalImage} alt="Fantasy Result" className="rounded shadow-lg w-full max-w-lg" />
      ) : (
        <p>Image not found. Please complete the quiz and selfie steps again.</p>
      )}
    </div>
  );
}

