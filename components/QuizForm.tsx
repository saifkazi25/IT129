'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  'What time of day makes you feel most alive?',
  'Pick a city you’d love to explore.',
  'Choose the role you play in a fantasy world:',
  'Describe your outfit in that world:',
  'What environment surrounds you?',
  'What’s the overall vibe or mood?',
  'If you had one power, what would it be?',
];

export default function QuizForm() {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const router = useRouter();

  const handleChange = (idx: number, val: string) => {
    const copy = [...answers];
    copy[idx] = val;
    setAnswers(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simple validation
    if (answers.some((a) => a.trim() === '')) {
      alert('Please answer every question 🚀');
      return;
    }

    // 💾 store latest answers
    localStorage.setItem('quizAnswers', JSON.stringify(answers));

    // go to selfie step
    router.push('/selfie');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 bg-white text-black">
      <h1 className="text-3xl font-bold">🌀 Infinite Tsukuyomi Quiz</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        {questions.map((q, i) => (
          <div key={i}>
            <label className="block font-semibold mb-1">{q}</label>
            <input
              type="text"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              cl
