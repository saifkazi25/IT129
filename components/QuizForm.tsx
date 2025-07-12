'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  "You wake up in a world where anything is possible. What's the first thing you notice?",
  "You're offered a portal to anywhere. What do you see through it?",
  "What would your outfit look like in this fantasy world?",
  "You are granted one special ability in this world. What is it?",
  "Pick the kind of environment you feel most drawn to.",
  "What kind of creatures or beings would you interact with?",
  "What emotion do you want to feel the most in this world?"
];

export default function QuizForm() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answers.some(answer => answer.trim() === '')) {
      setError('Please answer all the questions before proceeding.');
      return;
    }

    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/selfie');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">🌀 Enter the Infinite Tsukuyomi</h1>
      {questions.map((q, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-2 font-semibold">{q}</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            required
          />
        </div>
      ))}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
      >
        Next: Upload Your Selfie
      </button>
    </form>
  );
}
