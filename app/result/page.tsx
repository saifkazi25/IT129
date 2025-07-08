'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ResultPage() {
  const [prompt, setPrompt] = useState('');
  const [selfie, setSelfie] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const answers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
    const selfieData = localStorage.getItem('selfieImage');

    if (!selfieData || answers.length !== 7) {
      setError('Missing data — please redo quiz & selfie.');
      return;
    }

    setPrompt(answers.join(', '));
    setSelfie(selfieData);

    (async () => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, image: selfieData }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'API error');
        setGenerated(data.output);
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, []);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-8">
      <h1 className="text-3xl font-bold">🧙‍♂️ Your Fantasy</h1>

      {selfie && (
        <img src={selfie} alt="Selfie" className="w-40 h-40 rounded-xl object-cover" />
      )}

      <p className="italic text-blue-600 text-center">{prompt}</p>

      <div className="relative w-[300px] h-[300px] rounded-xl border shadow">
        {generated ? (
          <Image src={generated} alt="Result" layout="fill" objectFit="cover" className="rounded-xl" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Generating…
          </div>
        )}
      </div>
    </div>
  );
}
