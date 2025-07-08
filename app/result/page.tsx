'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ClientResult() {
  const searchParams = useSearchParams();

  const q0 = searchParams.get('q0');
  const q1 = searchParams.get('q1');
  const q2 = searchParams.get('q2');
  const q3 = searchParams.get('q3');
  const q4 = searchParams.get('q4');
  const q5 = searchParams.get('q5');
  const q6 = searchParams.get('q6');
  const selfie = searchParams.get('image');

  const fantasyPrompt = `${q0}, ${q1}, ${q2}, ${q3}, ${q4}, ${q5}, ${q6}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🧠 Your Fantasy is Loading...
      </h1>
      {selfie && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Your Selfie:</p>
          <img
            src={selfie}
            alt="User selfie"
            className="w-48 h-48 object-cover rounded-xl mx-auto"
          />
        </div>
      )}
      <p className="text-center text-lg font-medium mb-4">
        Based on your answers: <br />
        <span className="italic text-blue-600">{fantasyPrompt}</span>
      </p>

      {/* Image from replicate API - generatedResult */}
      <div className="relative w-[300px] h-[300px] rounded-xl shadow-lg border border-gray-300 bg-gray-100">
        <Image
          src={`/api/generate?q0=${q0}&q1=${q1}&q2=${q2}&q3=${q3}&q4=${q4}&q5=${q5}&q6=${q6}&image=${encodeURIComponent(selfie ?? '')}`}
          alt="Generated Fantasy"
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading your fantasy result...</div>}>
      <ClientResult />
    </Suspense>
  );
}
