'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateImage = async () => {
      const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
      const selfieDataUrl = localStorage.getItem('selfieDataUrl');

      if (!quizAnswers.length || !selfieDataUrl) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizAnswers, selfieDataUrl }),
        });

        const data = await response.json();
        console.log('🌟 Final result payload:', data);

        if (data.mergedImageUrl) {
          setMergedImageUrl(data.mergedImageUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('❌ Error generating image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🌌 Your Infinite Tsukuyomi</h1>

      {loading && <p className="text-lg">🧠 Generating your fantasy scene...</p>}

      {!loading && error && (
        <p className="text-red-600 text-center mt-4">
          ⚠️ Missing quiz answers or selfie. Please go back and try again.
        </p>
      )}

      {!loading && mergedImageUrl && (
        <div className="mt-6">
          <img
            src={mergedImageUrl}
            alt="Final Fantasy Image with Your Face"
            className="rounded-xl shadow-lg max-w-full"
          />
        </div>
      )}
    </div>
  );
}
