'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [img, setImg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const answersRaw = localStorage.getItem('quizAnswers');
    const selfie = localStorage.getItem('selfie');

    if (!answersRaw || !selfie) {
      router.push('/');
      return;
    }

    const run = async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizAnswers: JSON.parse(answersRaw),
            image: selfie,
          }),
        });
        if (!res.ok) throw new Error('Generation failed');
        const { mergedImage } = await res.json();
        setImg(mergedImage);
      } catch (e: any) {
        setErr(e.message || 'Unexpected error');
      }
    };

    run();
  }, [router]);

  if (err) return <p className="text-red-600 p-8">{err}</p>;
  if (!img) return <p className="p-8">⏳ Crafting your fantasy…</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <img src={img} alt="Infinite Tsukuyomi" className="max-w-full rounded-2xl shadow-lg" />
      <button
        onClick={() => { localStorage.clear(); router.push('/'); }}
        className="mt-6 text-blue-400 underline"
      >
        🔁 Start Again
      </button>
    </main>
  );
}
