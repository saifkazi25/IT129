'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [finalImage, setFinalImage] = useState<string | null>(null);

  useEffect(() => {
    const img = searchParams.get('img');
    if (img) {
      setFinalImage(img);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Your Fantasy Self Awaits
      </h1>

      {finalImage ? (
        <img
          src={finalImage}
          alt="Your Infinite Tsukuyomi Fantasy"
          className="rounded-lg shadow-lg w-full max-w-2xl"
        />
      ) : (
        <p className="text-red-500">No image found. Please complete the quiz and selfie again.</p>
      )}
    </div>
  );
}
