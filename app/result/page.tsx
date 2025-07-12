'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [status, setStatus] = useState('Generating your dream world...');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const quizAnswersRaw = localStorage.getItem('quizAnswers');
    const selfie = localStorage.getItem('selfie');

    if (!quizAnswersRaw || !selfie) {
      alert('Missing quiz answers. Redirecting...');
      window.location.href = '/';
      return;
    }

    const quizAnswers = JSON.parse(quizAnswersRaw);
    const prompt = `A fantasy scene featuring a person with elements: ${quizAnswers.join(', ')}. High quality, full body, colorful, fantasy artwork, cinematic lighting`;

    const generate = async () => {
      setStatus('Creating your fantasy image...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, selfie }),
      });

      const data = await response.json();
      if (data.image) {
        setImageUrl(data.image);
        setStatus('Your fantasy image is ready!');
      } else {
        setStatus('Failed to generate image.');
      }
    };

    generate();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">🌌 Your Fantasy Awaits</h1>
      <p className="mb-4">{status}</p>
      {imageUrl && <img src={imageUrl} alt="Your Fantasy World" className="max-w-full rounded" />}
    </main>
  );
}
