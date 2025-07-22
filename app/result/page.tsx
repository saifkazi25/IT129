'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedImage = async () => {
      try {
        // Make the API call to trigger generation
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // Inject answers/selfie from a centralized state here if needed
            quizAnswers: [
              'Magic', 'London', 'Wizard', 'Robe', 'Castle', 'Fun', 'Fire',
            ],
            selfieUrl: 'https://res.cloudinary.com/djm1jppes/image/upload/v1753204824/bubzveqm731ukjirl5xf.jpg',
          }),
        });

        const data = await response.json();

        if (response.ok && data.finalImageUrl) {
          setImageUrl(data.finalImageUrl);
        } else {
          console.error('❌ Generation failed:', data);
          setError('Something went wrong while generating your fantasy image.');
        }
      } catch (err) {
        console.error('❌ API error:', err);
        setError('Failed to generate the image. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedImage();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Your Infinite Tsukuyomi
      </h1>

      {loading && <p>✨ Generating your fantasy image...</p>}

      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>
      )}

      {imageUrl && !error && (
        <div>
          <img
            src={imageUrl}
            alt="Your fantasy world"
            style={{ maxWidth: '100%', marginTop: '1rem', borderRadius: '12px' }}
          />
        </div>
      )}
    </div>
  );
}
