'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/quiz');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">🌌 Infinite Tsukuyomi</h1>
      <p className="mb-4 text-lg text-center max-w-md">
        Answer a few deep questions to explore the dream version of you — then let AI recreate it with a photo.
      </p>
      <button
        onClick={handleStart}
        className="mt-4 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all"
      >
        Start the Quiz
      </button>
    </main>
  );
}
