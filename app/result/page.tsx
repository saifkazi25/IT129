'use client'

import { Suspense } from 'react';
import ResultContent from './ResultContent';

export default function ResultPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <Suspense fallback={<p>Loading your fantasy world…</p>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}

