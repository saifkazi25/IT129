'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const webcamRef = useRef<typeof Webcam | null>(null); // ✅ FIXED HERE
  const [image, setImage] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedAnswers = localStorage.getItem('quizAnswers');
    if (savedAnswers) {
      setQuizAnswers(JSON.parse(savedAnswers));
    } else {
      router.push('/'); // redirect if no quiz answers
    }
  }, [router]);

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
    }
  };

  const handleSubmit = async () => {
    if (!image || !quizAnswers) return;
    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizAnswers,
          image,
        }),
      });

      const data = await response.json();
      if (data.finalImage) {
        localStorage.setItem('finalImage', data.finalImage);
        router.push('/result');
      } else {
        alert('Image generation failed');
      }
    } catch (err) {
      console.error('Error generating image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full max-w-sm rounded-lg shadow"
          />
          <button
            onClick={capture}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={image}
            alt="Captured selfie"
            className="w-full max-w-sm rounded-lg shadow"
          />
          <button
            onClick={() => setImage(null)}
            className="mt-2 text-blue-500 underline"
          >
            Retake
          </button>
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate My Fantasy'}
      </button>
    </main>
  );
}
