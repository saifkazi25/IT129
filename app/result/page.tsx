'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateImage = async () => {
      const quizAnswersRaw = localStorage.getItem('quizAnswers');
      const selfieDataUrl = localStorage.getItem('selfieDataUrl');

      if (!quizAnswersRaw || !selfieDataUrl) {
        setError(true);
        setLoading(false);
        return;
      }

      const quizAnswers = JSON.parse(quizAnswersRaw);

      if (!quizAnswers.length) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        console.log('✅ Retrieved quizAnswers from localStorage:', quizAnswers);
        console.log('🧪 Final payload to /api/generate:', { quizAnswers, selfieDataUrl });

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizAnswers, selfieDataUrl }),
        });

        const data = await response.json();
        console.log('🌟 Final merged image URL:', data.mergedImageUrl);

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
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-center">🌌 Your Infinite Tsukuyomi</h1>

      {loading && (
        <p className="text-lg text-gray-600 animate-pulse">🧠 Generating your fantasy scene...</p>
      )}

      {!loading && error && (
        <p className="text-red-600 text-center mt-4">
          ⚠️ Missing quiz answers or selfie. Please go back and try again.
        </p>
      )}

      {!loading && mergedImageUrl && (
        <div className="mt-6">
          <img
            src={mergedImageUrl}
            alt="Your fantasy with your face"
            className="rounded-xl shadow-lg max-w-full"
          />
        </div>
      )}
    </div>
  );
}
