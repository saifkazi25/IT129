'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
    const selfieUrl = localStorage.getItem('selfieUrl');

    console.log('✅ Retrieved quizAnswers from localStorage:', quizAnswers);
    console.log('📸 Retrieved selfieUrl from localStorage:', selfieUrl);

    if (quizAnswers.length !== 7 || !selfieUrl) {
      setError('Missing quiz answers or selfie. Please go back and try again.');
      setLoading(false);
      return;
    }

    const payload = { quizAnswers, selfieUrl };
    console.log('🧪 Final payload to /api/generate:', payload);

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error('❌ /api/generate failed:', err);
          throw new Error(err.message || 'Image generation failed');
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ /api/generate success:', data);
        setImageUrl(data.mergedImageUrl);
      })
      .catch((err) => {
        console.error('❌ Error in fetch:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Generating your fantasy image...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="flex justify-center mt-10">
      <img src={imageUrl} alt="Final fantasy result" className="rounded-lg shadow-xl max-w-full h-auto" />
    </div>
  );
}
