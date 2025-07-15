'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateImage = async () => {
      const quiz = localStorage.getItem('quizAnswers');
      const selfieUrl = localStorage.getItem('selfieUrl');

      if (!quiz || !selfieUrl) {
        console.warn('⚠️ Missing quiz or selfie data. Redirecting to quiz.');
        window.location.href = '/';
        return;
      }

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers: JSON.parse(quiz),
            selfieUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Image generation failed');
        }

        const { mergedImageUrl } = await response.json();
        setImage(mergedImageUrl);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      {loading && <p>Generating your fantasy image...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {image && (
        <>
          <h1 className="text-2xl font-bold mb-4">🌟 Your Fantasy Awaits</h1>
          <img src={image} alt="Your fantasy world" className="rounded shadow-md max-w-full" />
        </>
      )}
    </div>
  );
}

