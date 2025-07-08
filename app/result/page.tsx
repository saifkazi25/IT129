'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import ResultDisplay from '@/components/ResultDisplay';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResult = async () => {
      const selfie = localStorage.getItem('selfie');
      if (!selfie) return;

      setLoading(true);
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selfie,
            q0: searchParams.get('q0'),
            q1: searchParams.get('q1'),
            q2: searchParams.get('q2'),
            q3: searchParams.get('q3'),
            q4: searchParams.get('q4'),
            q5: searchParams.get('q5'),
            q6: searchParams.get('q6'),
          }),
        });

        const data = await res.json();
        setImage(data.image);
      } catch (err) {
        console.error('Generation failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy Image</h1>
      {loading && <p>Generating your dream world… please wait.</p>}
      {!loading && image && <ResultDisplay image={image} />}
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading your results...</p>}>
      <ResultPageContent />
    </Suspense>
  );
}
