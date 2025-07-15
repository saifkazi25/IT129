'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  'What kind of world excites you the most?',
  'Pick a city or landscape you dream about.',
  'Choose a role you’d love to live as.',
  'What type of outfit would you wear in this world?',
  'Pick a fantasy setting you’d love to explore.',
  'What’s the vibe of your dream world?',
  'Choose a magical ability or skill.'
];

export default function QuizForm() {
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answers.some((ans) => ans.trim() === '')) {
      alert('Please answer all questions.');
      return;
    }

    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    console.log('✅ Saved quizAnswers to localStorage:', answers);
    router.push('/selfie');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {questions.map((question, index) => (
        <div key={index} className="flex flex-col">
          <label className="font-semibold">{question}</label>
          <input
            type="text"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            className="border rounded px-3 py-2 mt-1"
            required
          />
        </div>
      ))}

      <button
        type="submit"
        className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        Next: Take Selfie
      </button>
    </form>
  );
}
