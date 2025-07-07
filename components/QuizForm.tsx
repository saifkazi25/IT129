'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  'What would a perfect day look like for you?',
  'If you could go anywhere right now, where would you go?',
  'Who are you in your dream life? Describe yourself.',
  'What are you wearing in your dream world?',
  'Describe the environment or scenery around you.',
  'What emotion do you feel most deeply in this fantasy?',
  'What’s one magical or surreal detail that exists in your fantasy?'
];

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    answers.forEach((ans, i) => query.append(`q${i}`, ans));
    router.push(`/selfie?${query.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((q, i) => (
        <div key={i}>
          <label className="block mb-1 font-semibold">{q}</label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
      >
        Next ➡️
      </button>
    </form>
  );
}
