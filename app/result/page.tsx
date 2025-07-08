'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ResultPage() {
  const [outputUrl, setOutputUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      const selfie = localStorage.getItem('selfie');
      const answers = JSON.parse(localStorage.getItem('answers') || '[]');

      if (!selfie || answers.length !== 7) {
        setError('Missing selfie or answers.');
        return;
      }

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, image: selfie }),
        });

        const data = await res.json();
        if (data.output && Array.isArray(data.output)) {
          setOutputUrl(data.output[0]);
        } else {
          setError('No image returned.');
        }
      } catch (err) {
        setError('API error.');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">✨ Generating your fantasy...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500 text-center">❌ {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">🌌 Your Fantasy Image</h1>
      <img src={outputUrl} alt="Fantasy result" className="rounded-xl shadow-xl w-[300px] h-[300px]" />
    </div>
  );
}
