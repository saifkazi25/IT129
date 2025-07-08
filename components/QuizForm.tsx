'use client';

import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function QuizForm() {
  const [answers, setAnswers] = useState(Array(7).fill(''));
  const [selfie, setSelfie] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const questions = [
    'Pick a mood:',
    'Choose a city:',
    'Select a role:',
    'Pick an outfit:',
    'Choose a setting:',
    'What vibe do you want?',
    'Pick a superpower:',
  ];

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const captureSelfie = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setSelfie(img);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) {
      alert('Please take a selfie first!');
      return;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, image: selfie }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      router.push(`/result?image=${encodeURIComponent(data.image)}`);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4 text-black">
      {questions.map((q, i) => (
        <div key={i}>
          <label className="block mb-1 font-semibold">{q}</label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
      ))}

      <div className="my-4">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded w-full h-auto"
        />
        <button
          type="button"
          onClick={captureSelfie}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          📸 Take Selfie
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        🔮 Generate Fantasy
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}


