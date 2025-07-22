// app/result/page.tsx
import React, { Suspense } from 'react';
import ResultContent from '../../components/ResultContent';

export default function ResultPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Infinite Tsukuyomi
      </h1>
      <Suspense fallback={<p className="text-xl text-gray-500">Loading your dream world...</p>}>
        <ResultContent />
      </Suspense>
    </div>
  );
}
