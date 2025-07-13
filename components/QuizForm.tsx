'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  "What time of day do you feel most alive?",
  "Pick a destination you'd teleport to right now.",
  "What kind of hero are you?",
  "Your dream outfit?",
  "Ideal environment for an adventure?",
  "What emotion drives your fantasy world?",
  "What supernatural power would you pick?"
];

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

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
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      {questions.map((question, index) => (
        <div key={index}>
          <label className="block mb-1 text-sm font-semibold">{question}</label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            required
          />
        </div>
      ))}
      <button type="submit" className="w-full bg-black text-white py-2 rounded">Next: Take Selfie</button>
    </form>
  );
}
