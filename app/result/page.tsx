'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ClientResult() {
  const searchParams = useSearchParams();
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q0 = searchParams.get('q0');
  const q1 = searchParams.get('q1');
  const q2 = searchParams.get('q2');
  const q3 = searchParams.get('q3');
  const q4 = searchParams.get('q4');
  const q5 = searchParams.get('q5');
  const q6 = searchParams.get('q6');
  const selfie = searchParams.get('image');

  const answers = [q0, q1, q2, q3, q4, q5, q6];

  useEffect(() => {
    async function generateFantasyImage() {
      if (!selfie || answers.includes(null)) {
        setError('Missing inputs or selfie.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers,
            image: selfie,
          }),
        });

        const data = await res.json();

        if (res.ok && data.output) {
          setGeneratedImage(data.output);
        } else {
          setError(data.error || 'Image generation failed.');
        }
      } catch (err) {
        setError('Network error or server crashed.');
      } finally {
        setLoading(false);
      }
    }

    generateFantasyImage();
  }, [selfie, ...answers]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        🧠 Your Fantasy is Loading...
      </h1>

      {selfie && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Your Selfie:</p>
          <img
            src={selfie}
            alt="User selfie"
            className="w-48 h-48 object-cover rounded-xl mx-auto"
          />
        </div>
      )}

      <p className="text-center text-lg font-medium mb-4">
        Based on your answers:
        <br />
        <span className="italic text-blue-600">{answers.join(', ')}</span>
      </p>

      {loading && <p className="text-gray-500">✨ Creating your fantasy image...</p>}

      {error && (
        <p className="text-red-500 text-sm text-center mt-4">
          ❌ {error}
        </p>
      )}

      {generatedImage && (
        <img
          src={generatedImage}
          alt="Fantasy result"
          className="mt-6 w-[300px] h-[300px] object-cover rounded-xl shadow-lg border"
        />
      )}
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading your fantasy result...</div>}>
      <ClientResult />
    </Suspense>
  );
}
