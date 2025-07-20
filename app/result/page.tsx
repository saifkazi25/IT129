'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get('imageUrl');
  const [status, setStatus] = useState('Loading your fantasy image...');

  useEffect(() => {
    if (!imageUrl) {
      setStatus('No image found. Please try again.');
    } else {
      setStatus('Here is your fantasy image!');
    }
  }, [imageUrl]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Infinite Tsukuyomi Result</h1>
      <p className="text-gray-600 mb-4">{status}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Fantasy Result"
          className="rounded shadow-md max-w-full h-auto"
        />
      )}
    </div>
  );
}
