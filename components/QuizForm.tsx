'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  'What time of day do you feel most alive?',
  'Pick a city you’d love to explore.',
  'What archetype do you resonate with most?',
  'What kind of outfit would you wear in your fantasy world?',
  'Describe the environment around you.',
  'What’s the overall vibe or mood?',
  'If you had a power, what would it be?',
];

export default function QuizForm() {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((ans) => ans.trim() === '')) {
      alert('Please answer all questions!');
      return;
    }

    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/selfie');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">✨ Discover Your Fantasy</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        {questions.map((question, i) => (
          <div key={i}>
            <label className="block font-semibold mb-1">{question}</label>
            <input
              type="text"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
        >
          📸 Continue to Selfie
        </button>
      </form>
    </main>
  );
}

