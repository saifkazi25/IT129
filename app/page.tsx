'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const Webcam = dynamic(() => import('react-webcam'), { ssr: false }) as any;

export default function Home() {
  const webcamRef = useRef<any>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  };

  const handleContinue = () => {
    if (imgSrc) {
      const encoded = encodeURIComponent(imgSrc);
      router.push(`/result?image=${encoded}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Capture Your Fantasy Selfie</h1>

      <div className="w-full max-w-sm">
        {imgSrc ? (
          <img src={imgSrc} alt="Captured" className="rounded-xl mb-4" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
        )}

        {!imgSrc ? (
          <button
            onClick={capture}
            className="w-full bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
          >
            Capture
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Continue
          </button>
        )}
      </div>
    </main>
  );
}
