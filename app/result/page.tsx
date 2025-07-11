'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ResultPage() {
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [merging, setMerging] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedAnswers = localStorage.getItem('quizAnswers');
    const storedSelfie = localStorage.getItem('selfieImage');
    if (storedAnswers && storedSelfie) {
      setAnswers(JSON.parse(storedAnswers));
      setSelfieImage(storedSelfie);
    }
  }, []);

  // Send data to backend once loaded
  useEffect(() => {
    const generateImage = async () => {
      if (!answers.length || !selfieImage) return;
      setLoading(true);
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, selfieImage }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Image generation failed');

        setFantasyImage(data.fantasyImage); // raw SDXL image
        setMergedImage(data.mergedImage);   // final merged image
      } catch (err: any) {
        console.error('❌ Error generating image:', err);
        alert('Something went wrong: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, [answers, selfieImage]);

  const handleMerge = async () => {
    if (!fantasyImage || !selfieImage) return;
    setMerging(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, selfieImage }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Merge failed');

      setMergedImage(data.mergedImage);
    } catch (err: any) {
      console.error('❌ Error during merge:', err);
      alert('Merging failed: ' + err.message);
    } finally {
      setMerging(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-4">🌟 Your Fantasy Awaits</h1>

      {answers.length > 0 && (
        <div className="mb-6 text-center">
          <p className="text-lg font-semibold">Your Fantasy World Based on Your Answers:</p>
          <ul className="list-disc list-inside mt-2">
            {answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
        </div>
      )}

      {loading && <p>Generating your fantasy world...</p>}

      {!loading && fantasyImage && (
        <>
          <div className="mb-4">
            <p className="text-md font-semibold mb-2">Fantasy Image:</p>
            <Image
              src={fantasyImage}
              alt="Fantasy Image"
              width={512}
              height={512}
              className="rounded-md"
            />
          </div>

          {mergedImage ? (
            <div>
              <p className="text-md font-semibold mb-2">✨ You in Your Fantasy World:</p>
              <Image
                src={mergedImage}
                alt="Merged Fantasy"
                width={512}
                height={512}
                className="rounded-md"
              />
            </div>
          ) : (
            <button
              onClick={handleMerge}
              disabled={merging}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {merging ? 'Merging...' : 'Merge My Face'}
            </button>
          )}
        </>
      )}
    </main>
  );
}
