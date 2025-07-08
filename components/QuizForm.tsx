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
    'What is the overall *mood* of your dream world?',
    'Where would it be set? (location or realm)',
    'What would you look like in it? (e.g., elf, warrior, etc.)',
    'What would you be wearing?',
    'What would be in the background?',
    'What kind of vibe or theme would it have?',
    'What would be your special ability or role?',
  ];

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const captureSelfie = () => {
    if (webcamRef.current) {
      const img = webcamRef.current.getScreenshot();
      if (img) {
        setSelfie(img);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) {
      setError('Please capture a selfie.');
      return;
    }

    console.log("Submitting data:", {
      answers,
      selfie,
    });

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q0: answers[0],
          q1: answers[1],
          q2: answers[2],
          q3: answers[3],
          q4: answers[4],
          q5: answers[5],
          q6: answers[6],
          image: selfie,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('API error:', data);
        setError(data.error || 'Something went wrong.');
        return;
      }

      router.push(`/result?image=${encodeURIComponent(data.image)}`);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to generate fantasy image.');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">✨ Build Your Fantasy</h1>

        {questions.map((q, i) => (
          <div key={i}>
            <label className="block mb-1 font-medium">{q}</label>
            <input
              type="text"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div>
          <p className="mb-2 font-medium">📸 Capture Your Selfie:</p>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded border"
          />
          <button
            type="button"
            onClick={captureSelfie}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Capture Selfie
          </button>
          {selfie && (
            <div className="mt-4">
              <p className="mb-1 font-medium">Preview:</p>
              <img src={selfie} alt="Selfie preview" className="rounded border" />
            </div>
          )}
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-purple-600 text-white font-bold rounded hover:bg-purple-700"
        >
          Submit & See My Fantasy
        </button>
      </form>
    </div>
  );
}
