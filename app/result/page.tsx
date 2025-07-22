'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateImage = async () => {
      const storedAnswers = localStorage.getItem('quizAnswers');
      const storedSelfie = localStorage.getItem('selfieDataUrl');

      if (!storedAnswers || !storedSelfie) {
        console.warn('Missing data in localStorage');
        setIsLoading(false);
        return;
      }

      try {
        const quizAnswers: string[] = JSON.parse(storedAnswers);
        const selfieDataUrl: string = storedSelfie;

        console.log('✅ Retrieved quizAnswers from localStorage:', quizAnswers);
        console.log('📸 Retrieved selfieDataUrl from localStorage:', selfieDataUrl);

        const payload = { quizAnswers, selfieDataUrl };
        console.log('🧪 Final payload to /api/generate:', payload);

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.finalImageUrl) {
          console.log('🌟 Final merged image URL:', data.finalImageUrl);
          setFinalImage(data.finalImageUrl);
        } else {
          console.error('No image returned from backend:', data);
        }
      } catch (error) {
        console.error('❌ Error generating image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>🌌 Your Infinite Tsukuyomi</h1>

      {isLoading ? (
        <p>Generating your fantasy image...</p>
      ) : finalImage ? (
        <img
          src={finalImage}
          alt="Your Fantasy World"
          style={{ maxWidth: '100%', borderRadius: '1rem', boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}
        />
      ) : (
        <p style={{ color: 'red' }}>⚠️ Missing quiz answers or selfie. Please go back and try again.</p>
      )}
    </div>
  );
}
