'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const finalImageUrl = searchParams.get('img');

  if (!finalImageUrl) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        ❌ No image to display. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-6">🌙 Your Infinite Tsukuyomi</h1>
      <img
        src={finalImageUrl}
        alt="Infinite Tsukuyomi Result"
        className="max-w-full max-h-screen rounded-lg shadow-lg"
      />
      <a
        href={finalImageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 bg-white text-black px-6 py-3 rounded hover:bg-gray-200 transition"
      >
        View Full Image
      </a>
    </div>
  );
}
