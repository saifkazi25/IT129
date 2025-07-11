'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [result, setResult] = useState<string | null>(null);
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const answers = localStorage.getItem('fantasyAnswers');
      const selfieImage = localStorage.getItem('selfieImage');

      if (!answers || !selfieImage) {
        alert('Missing answers or selfie image.');
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: JSON.parse(answers),
            image: selfieImage,
          }),
        });

        const data = await response.json();
        setResult(data.result);
        setFantasyImage(data.fantasyImage);
      } catch (err) {
        console.error('Generation failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white text-black text-center">
      <h1 className="text-3xl font-bold mb-4">🖼️ Your Tsukuyomi Fantasy</h1>
      {loading ? (
        <p>✨ Generating your fantasy world... Please wait.</p>
      ) : result ? (
        <img src={result} alt="Final Fantasy Image" className="mx-auto rounded-lg" />
      ) : (
        <p>❌ Something went wrong. Please try again.</p>
      )}

      {fantasyImage && (
        <div className="mt-6">
          <p className="text-gray-600">Base fantasy image (before FaceFusion):</p>
          <img src={fantasyImage} alt="Fantasy Base" className="mx-auto w-1/2 rounded" />
        </div>
      )}
    </div>
  );
}


