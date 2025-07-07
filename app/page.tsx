'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  "If you could live in any time period, which would it be?",
  "What superpower do you secretly wish for?",
  "Pick your fantasy world: sci-fi, medieval, utopian, or dystopian?",
  "You wake up as the main character in your favorite movie. What is it?",
  "Would you rather be loved, feared, or worshipped?",
  "What color dominates your dream environment?",
  "Who’s beside you in your fantasy life (if anyone)?",
];

export default function Home() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    answers.forEach((answer, index) => {
      params.append(`q${index + 1}`, answer);
    });

    router.push(`/selfie?${params.toString()}`);
  };

  return (
    <main className="min-h-screen p-6 bg-white text-black flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">🔮 Discover Your Fantasy Life</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
        {questions.map((question, index) => (
          <div key={index}>
            <label className="block font-medium mb-2">{question}</label>
            <input
              type="text"
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
        ))}
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next: Take a Selfie 📸
        </button>
      </form>
    </main>
  );
}
