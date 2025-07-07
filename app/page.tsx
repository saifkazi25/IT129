'use client';

import QuizForm from '@/components/QuizForm';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">🌌 Discover Your Inner World</h1>
        <QuizForm />
      </div>
    </main>
  );
}
