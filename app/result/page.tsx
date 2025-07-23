'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMergedImage = async () => {
      try {
        const storedAnswers = localStorage.getItem('quizAnswers');
        const storedSelfieUrl = localStorage.getItem('selfieUrl');

        if (!storedAnswers || !storedSelfieUrl) {
          setError('Missing quiz answers or selfie');
          setLoading(false);
          return;
        }

        const quizAnswers = JSON.parse(storedAnswers);
        const selfieUrl = storedSelfieUrl;

        console.log('🚀 Sending to /api/generate:', { quizAnswers, selfieUrl });

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();

        if (!response.ok || !data?.mergedImageUrl) {
          console.error('❌ API error:', data);
          setError('Image generation failed. Please try again.');
          setLoading(false);
          return;
        }

        console.log('✅ Merged image received:', data.mergedImageUrl);
        setMergedImageUrl(data.mergedImageUrl);
        setLoading(false);
      } catch (err) {
        console.error('❌ Unexpected error:', err);
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchMergedImage();
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🌟 Welcome to your fantasy</h1>

      {loading && <p>Generating your fantasy image...</p>}

      {error && !loading && (
        <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
      )}

      {!loading && mergedImageUrl && (
        <>
          <img
            src={mergedImageUrl}
            alt="Merged Fantasy"
            style={{ maxWidth: '100%', borderRadius: '12px', marginTop: '2rem' }}
          />
          <br />
          <a
            href={mergedImageUrl}
            download="merged_fantasy.jpg"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#0070f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
            }}
          >
            ⬇️ Download Image
          </a>
        </>
      )}
    </div>
  );
}
