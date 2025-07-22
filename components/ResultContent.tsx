'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultContent() {
  const searchParams = useSearchParams();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    const img = searchParams.get('img');
    if (img) {
      setImgUrl(img);
    }
  }, [searchParams]);

  if (!imgUrl) {
    return (
      <p className="text-red-500 text-center">
        No image found. Please go back and complete the quiz.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={imgUrl}
        alt="Your Infinite Tsukuyomi"
        className="rounded-xl shadow-2xl max-w-full h-auto"
      />
      <a
        href={imgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700"
      >
        View Full Image
      </a>
    </div>
  );
}
