'use client';

import React, { useEffect, useState } from 'react';

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
        const selfieUrl = localStorage.getItem('selfieUrl');

        if (!quizAnswers || quizAnswers.length !== 7 || !selfieUrl) {
          setError("Missing quiz answers or selfie");
          setLoading(false);
          return;
        }

        console.log("🚀 Sending to /api/generate:", { quizAnswers, selfieUrl });

        const res = await fetch('/api/generate', {
          method: 'POST',
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error("❌ /api/generate error:", err);
          setError(err.error || 'Failed to generate image');
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("✅ Merged image received:", data.mergedImageUrl);
        setMergedImageUrl(data.mergedImageUrl);
        setLoading(false);
      } catch (err) {
        console.error("❌ Unexpected error:", err);
        setError("Something went wrong while generating your image.");
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  if (loading) return <div className="p-6 text-xl">🌀 Generating your fantasy image...</div>;
  if (error) return <div className="p-6 text-red-600">❌ {error}</div>;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🌟 Your Infinite Tsukuyomi Fantasy 🌟</h1>
      {mergedImageUrl && (
        <img
          src={mergedImageUrl}
          alt="Your fantasy"
          className="mx-auto rounded-2xl shadow-lg max-w-full h-auto"
        />
      )}
    </div>
  );
}
