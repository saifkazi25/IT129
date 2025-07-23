'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateImage = async () => {
      const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
      const selfieUrl = localStorage.getItem('selfieUrl');

      console.log('✅ Retrieved quizAnswers from localStorage:', quizAnswers);
      console.log('✅ Retrieved selfieUrl from localStorage:', selfieUrl);

      if (!quizAnswers || quizAnswers.length !== 7 || !selfieUrl) {
        console.error('❌ Missing quiz answers or selfie');
        setError('Missing quiz answers or selfie. Please go back and try again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }) // Important: match backend
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Image generation failed');
        }

        const data = await response.json();
        setMergedImageUrl(data.mergedImageUrl);
        setLoading(false);
      } catch (err: any) {
        console.error('❌ /api/generate failed:', err);
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-xl">🔮 Generating your fantasy image...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600 text-lg">❌ {error}</div>;
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-6">🌌 Your Fantasy World Awaits</h1>
      {mergedImageUrl && (
        <img
          src={mergedImageUrl}
          alt="Your fantasy image"
          className="mx-auto max-w-[90%] border rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}
