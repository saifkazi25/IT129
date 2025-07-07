'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import type * as ReactWebcam from 'react-webcam';

const Webcam = dynamic(() => import('react-webcam').then(mod => mod.default), {
  ssr: false,
}) as React.ComponentType<ReactWebcam.WebcamProps>;

export default function SelfiePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setScreenshot(imageSrc);
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) return;
    setLoading(true);

    const questions: string[] = [];
    for (let i = 0; i < 7; i++) {
      const value = searchParams.get(`q${i}`);
      if (value) questions.push(value);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions, selfie: screenshot }),
    });

    const data = await response.json();
    router.push(`/result?imageUrl=${encodeURIComponent(data.imageUrl)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">📸 Take a Selfie</h1>

      {!screenshot ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={handleCapture}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={screenshot} alt="Your selfie" className="rounded-xl border mb-4" />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
          >
            {loading ? 'Generating Image...' : 'Submit & See Result'}
          </button>
        </>
      )}
    </main>
  );
}
