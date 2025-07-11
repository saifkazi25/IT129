'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  'What environment feels most magical to you?',
  'Pick a city you dream of exploring.',
  'Choose a role you’d love to embody.',
  'What would you wear in that dream?',
  'Where do you want this adventure to take place?',
  'What emotion drives your fantasy?',
  'What power would you want to have?',
];

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/selfie');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q, i) => (
        <div key={i}>
          <label className="block font-medium text-lg mb-1">{q}</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
      >
        Continue to Selfie
      </button>
    </form>
  );
}

