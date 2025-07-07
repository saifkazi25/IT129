'use client';

import { useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { MutableRefObject } from 'react';

// Dynamic import to avoid SSR issues
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

export default function SelfiePage() {
  const webcamRef = useRef<any>(null); // Use <any> to avoid TS error for now
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  };

  const handleSubmit = async () => {
    if (!imgSrc) return alert('Please take a photo first.');

    const answers: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      answers[key] = value;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, selfie: imgSrc }),
      });

      const data = await response.json();
      router.push(`/result?url=${encodeURIComponent(data.imageUrl)}`);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Something went wrong while generating your image.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Take a Selfie</h1>

      {!imgSrc ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={capture}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
          >
            📸 Capture
          </button>
        </>
      ) : (
        <>
          <img src={imgSrc} alt="Captured" className="rounded-xl mb-4 border" />
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800"
          >
            🚀 Generate My Fantasy
          </button>
        </>
      )}
    </div>
  );
}
