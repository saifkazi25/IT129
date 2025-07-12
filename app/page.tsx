'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));

  const handleChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    const allAnswered = answers.every((a) => a.trim() !== '');
    if (!allAnswered) {
      alert('Please answer all questions!');
      return;
    }

    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/selfie');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Infinite Tsukuyomi Quiz</h1>
      {[
        'What environment feels most magical to you?',
        'Pick a city you dream of exploring.',
        'Choose a role you’d love to embody.',
        'What would you wear in that dream?',
        'What kind of setting is it? (Forest, Sky, Space...)',
        'What emotion do you seek in this fantasy?',
        'What supernatural ability do you want?'
      ].map((question, index) => (
        <div key={index} className="mb-4 w-full max-w-md">
          <label className="block mb-2">{question}</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={answers[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-black text-white px-4 py-2 rounded"
      >
        Next
      </button>
    </main>
  );
}
