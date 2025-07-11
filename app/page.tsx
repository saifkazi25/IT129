'use client';

import QuizForm from '../components/QuizForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 bg-white text-black">
      <h1 className="text-4xl font-bold text-center">🌌 Infinite Tsukuyomi Quiz</h1>
      <QuizForm />
    </main>
  );
}

