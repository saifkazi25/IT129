'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
      const selfieUrl = localStorage.getItem('selfieUrl');

      console.log('✅ Retrieved quizAnswers from localStorage:', quizAnswers);
      console.log('✅ Retrieved selfieUrl from localStorage:', selfieUrl);

      const payload = { quizAnswers, selfieUrl };
      console.log('🧪 Final payload to /api/generate:', payload);

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ /api/generate failed:', errorData);
          setErrorMessage(errorData.error || 'Unknown error');
          setStatus('error');
          return;
        }

        const data = await response.json();
        console.log('✅ /api/generate success:', data);
        setImageUrl(data.mergedImageUrl); // assuming backend returns { mergedImageUrl }
        setStatus('success');
      } catch (err: any) {
        console.error('❌ /api/generate exception:', err);
        setErrorMessage(err.message || 'Unexpected error');
        setStatus('error');
      }
    };

    fetchImage();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white text-xl">
        🌀 Generating your Infinite Tsukuyomi...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-red-100 text-red-800 p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">⚠️ Something went wrong</h1>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-black text-white">
      <h1 className="text-3xl mb-6 font-bold">🌌 Your Infinite Tsukuyomi</h1>
      {imageUrl && (
        <>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg mb-4"
          >
            View Your Infinite Tsukuyomi
          </a>
          <img
            src={imageUrl}
            alt="Your fantasy image"
            className="w-full h-auto max-w-screen-lg rounded shadow-lg"
          />
        </>
      )}
    </div>
  );
}
