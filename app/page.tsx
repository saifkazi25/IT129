'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizForm from '../components/QuizForm';

export default function HomePage() {
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const router = useRouter();

  const handleQuizSubmit = (answers: string[]) => {
    setQuizAnswers(answers);
    router.push('/selfie', { scroll: false });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4">Enter Your Infinite Tsukuyomi</h1>
      <QuizForm onSubmit={handleQuizSubmit} />
    </main>
  );
}
