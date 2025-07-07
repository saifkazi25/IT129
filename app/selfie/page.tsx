'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SelfiePage() {
  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setScreenshot(imageSrc);

        const query: Record<string, string> = {};
        for (let i = 0; i < 7; i++) {
          const value = searchParams.get(`q${i}`);
          if (value) query[`q${i}`] = value;
        }
        query['selfie'] = encodeURIComponent(imageSrc);

        const queryString = new URLSearchParams(query).toString();
        router.push(`/result?${queryString}`);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>
      {!screenshot ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{
              facingMode: 'user',
            }}
          />
          <button
            onClick={handleCapture}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <img src={screenshot} alt="Captured selfie" className="rounded-xl" />
      )}
    </main>
  );
}
