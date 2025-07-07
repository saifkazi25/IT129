'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import react-webcam dynamically to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), { ssr: false }) as any;

export default function SelfiePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState<string | null>(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = (webcamRef.current as any).getScreenshot();
      if (imageSrc) {
        setCaptured(imageSrc);

        // Collect all quiz answers from query params
        const params: { [key: string]: string } = {};
        for (let i = 0; i < 7; i++) {
          params[`q${i}`] = searchParams.get(`q${i}`) || '';
        }

        // Send data to the backend API
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imageSrc,
            ...params,
          }),
        })
          .then(res => res.json())
          .then(data => {
            router.push(`/result?output=${encodeURIComponent(data.output)}`);
          })
          .catch(err => {
            console.error('API error:', err);
            alert('Something went wrong. Please try again.');
          });
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>

      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-xl border mb-4"
          videoConstraints={{ facingMode: 'user' }}
        />
      </div>

      <button
        onClick={handleCapture}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Capture & Continue
      </button>

      {captured && (
        <div className="mt-6">
          <p className="text-lg mb-2">Preview:</p>
          <img src={captured} alt="Captured selfie" className="rounded-xl w-64 border" />
        </div>
      )}
    </main>
  );
}
