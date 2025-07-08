'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  "Pick a season you vibe with",
  "Choose a dream location",
  "What archetype are you?",
  "Pick a power outfit",
  "Your ideal world has...",
  "Choose a life theme",
  "Pick a special ability",
];

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(7).fill(''));

  const handleChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (answers.some(ans => ans.trim() === '')) {
      alert('Please answer all questions');
      return;
    }

    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/selfie');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q, idx) => (
        <div key={idx}>
          <label className="block font-semibold">{q}</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={answers[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            required
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-black text-white rounded">
        Next: Take Selfie
      </button>
    </form>
  );
}

