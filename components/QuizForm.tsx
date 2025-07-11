'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  "What season feels most magical to you?",
  "Pick a city you'd love to explore.",
  "Choose your character type.",
  "What outfit are you wearing?",
  "Pick an element in your scene.",
  "What feeling do you want to experience?",
  "Choose a superpower."
];

const QuizForm: React.FC = () => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("fantasyAnswers", JSON.stringify(answers));
    router.push("/selfie");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q, idx) => (
        <div key={idx}>
          <label className="block font-semibold mb-1">{q}</label>
          <input
            required
            type="text"
            value={answers[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
        Continue to Selfie
      </button>
    </form>
  );
};

export default QuizForm;

