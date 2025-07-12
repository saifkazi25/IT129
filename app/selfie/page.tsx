'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const webcamRef = useRef<Webcam | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
    }
  };

  const handleSubmit = () => {
    if (!image) return;
    localStorage.setItem('selfie', image);
    router.push('/result');
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-bold mb-4">📸 Take your selfie</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        className="rounded-md mb-4"
      />
      <button onClick={capture} className="mb-2 bg-blue-500 text-white px-4 py-2 rounded">
        Capture
      </button>
      {image && (
        <>
          <img src={image} alt="Captured" className="rounded mb-4 w-48 h-48 object-cover" />
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
            Submit & Continue
          </button>
        </>
      )}
    </main>
  );
}

