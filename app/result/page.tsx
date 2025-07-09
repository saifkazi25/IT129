'use client';
import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const answersStr = localStorage.getItem('quizAnswers');
    const selfieImage = localStorage.getItem('selfieImage');

    if (!answersStr || !selfieImage) {
      setError('Missing data — please redo quiz & selfie.');
      setLoading(false);
      return;
    }

    const answers = JSON.parse(answersStr);

    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, image: selfieImage }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.output && Array.isArray(data.output)) {
          setOutputUrl(data.output[0]); // ✅ Pick the first image URL
        } else {
          setError(data.error || 'Image generation failed.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Something went wrong.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>🌀 Generating your fantasy...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">🌌 Your Fantasy World</h1>
      {outputUrl && <img src={outputUrl} alt="Fantasy result" className="mx-auto rounded" />}
    </div>
  );
}
