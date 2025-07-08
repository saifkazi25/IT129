'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ClientResult from '@/components/ClientResult';

function ResultPageContent() {
  const searchParams = useSearchParams();

  const imageUrl = searchParams.get('imageUrl');
  const fantasyPrompt = searchParams.get('prompt');

  if (!imageUrl || !fantasyPrompt) {
    return (
      <div className="text-center text-red-500 mt-10">
        Missing image or prompt in the URL. Please retake the quiz.
      </div>
    );
  }

  return (
    <ClientResult imageUrl={imageUrl} fantasyPrompt={fantasyPrompt} />
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading your fantasy...</div>}>
      <ResultPageContent />
    </Suspense>
  );
}
