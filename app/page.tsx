'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generate = async () => {
      try {
        const storedAnswers = localStorage.getItem('answers');
        const storedSelfie = localStorage.getItem('selfie');

        if (!storedAnswers || !storedSelfie) {
          alert('Missing data. Please complete the quiz and take a selfie.');
          router.push('/');
          return;
        }

        const answers = JSON.parse(storedAnswers);

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers, selfie: storedSelfie }),
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setFantasyImage(result.fantasyImage);
        setMergedImage(result.mergedImage);
      } catch (error) {
        console.error('Error generating fantasy image:', error);
        alert('Something went wrong. Please try again.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Infinite Tsukuyomi</h1>
      {loading ? (
        <p>Generating your dream world...</p>
      ) : mergedImage ? (
        <img
          src={mergedImage}
          alt="Your fantasy world"
          className="rounded shadow-lg max-w-full h-auto"
        />
      ) : (
        <p>Image generation failed.</p>
      )}
    </main>
  );
}
