'use client';

import { useEffect, useState } from 'react';
import ResultDisplay from '../../components/ResultDisplay';

export default function ResultPage() {
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  useEffect(() => {
    const storedAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
    const storedSelfie = localStorage.getItem('selfieImage');

    setQuizAnswers(storedAnswers);
    setSelfieImage(storedSelfie);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-white text-black">
      <h1 className="text-3xl font-bold">🌟 Your Fantasy Awaits</h1>
      {quizAnswers.length > 0 && selfieImage ? (
        <ResultDisplay answers={quizAnswers} selfieImage={selfieImage} />
      ) : (
        <p>Loading your results...</p>
      )}
    </main>
  );
}
