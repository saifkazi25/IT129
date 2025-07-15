'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const questions = [
  'What kind of world excites you the most?',
  'Pick a city or landscape you dream about.',
  'Choose a role you’d love to live as.',
  'What kind of outfit would you wear in this fantasy?',
  'Pick a setting you’d want around you.',
  'What’s the vibe or mood of your ideal world?',
  'Would you rather fly, fight, or explore?',
];

export default function QuizForm() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => a.trim() === '')) {
      setError('Please answer all questions before continuing.');
      return;
    }

    try {
      localStorage.setItem('quizAnswers', JSON.stringify(answers));
      console.log('✅ Saved quizAnswers to localStorage:', answers);
      router.push('/selfie');
    } catch (err) {
      console.error('❌ Error saving quiz answers to localStorage:', err);
      setError('Failed to save your answers. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">✨ Enter Your Dream World</h1>
      {questions.map((q, i) => (
        <div key={i}>
          <label className="block font-semibold mb-2">{q}</label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full px-3 py-2 rounded border text-black"
          />
        </div>
      ))}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <button
        type="submit"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Continue to Selfie
      </button>
    </form>
  );
}
