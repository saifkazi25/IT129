'use client';

import { useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import type { MutableRefObject } from 'react';

// Dynamic import for react-webcam
const Webcam = dynamic(() => import('react-webcam') as any, {
  ssr: false,
}) as React.FC<any>;

function SelfiePageContent() {
  const webcamRef: MutableRefObject<any> = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) {
        setImage(screenshot);
        const queryString = Array.from(searchParams.entries())
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
        router.push(`/result?image=${encodeURIComponent(screenshot)}&${queryString}`);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Fantasy Selfie</h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-xl border mb-4"
        videoConstraints={{ facingMode: 'user' }}
      />

      <button
        onClick={capture}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Capture Selfie
      </button>

      {image && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Preview:</p>
          <img src={image} alt="Selfie Preview" className="mt-2 rounded-lg border" />
        </div>
      )}
    </main>
  );
}

export default function SelfiePage() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <SelfiePageContent />
    </Suspense>
  );
}
