'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const questions = [
  'What season feels most alive to you?',
  'Pick a city that sparks your imagination.',
  'Which archetype do you identify with most?',
  'What kind of outfit do you wear in your fantasy world?',
  'What’s the main landscape of your dream world?',
  'What’s your role in this world?',
  'Pick a magical ability you possess.',
];

const options = [
  ['Spring', 'Summer', 'Autumn', 'Winter'],
  ['Tokyo', 'Paris', 'New York', 'London'],
  ['Hero', 'Anti Hero', 'Villain', 'Mystic'],
  ['Cape', 'Suit', 'Robe', 'Armor'],
  ['Forest', 'Desert', 'Mountains', 'Cityscape'],
  ['Explorer', 'Leader', 'Guardian', 'Rebel'],
  ['Teleport', 'Fly', 'Control Time', 'Invisibility'],
];

export default function HomePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));

  const handleChange = (questionIndex: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    const isComplete = answers.every((a) => a !== '');
    if (!isComplete) return alert('Please answer all questions.');

    localStorage.setItem('fantasyAnswers', JSON.stringify(answers));
    router.push('/selfie');
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">🌀 Infinite Tsukuyomi Quiz</h1>
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index}>
            <p className="font-semibold mb-2">{question}</p>
            <div className="flex flex-wrap gap-2">
              {options[index].map((option) => (
                <button
                  key={option}
                  className={`px-4 py-2 border rounded ${
                    answers[index] === option ? 'bg-black text-white' : 'bg-gray-100'
                  }`}
                  onClick={() => handleChange(index, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Next: Upload Selfie
        </button>
      </div>
    </div>
  );
}
