'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
    }
  };

  const handleConfirm = () => {
    if (!image) return alert('Please take a selfie.');

    localStorage.setItem('selfieImage', image);
    router.push('/result');
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">📸 Take Your Selfie</h1>
      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={320}
            className="rounded border"
          />
          <button
            onClick={capture}
            className="mt-4 bg-black text-white px-4 py-2 rounded"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={image} alt="Selfie" className="rounded w-64 h-64 object-cover" />
          <button
            onClick={handleConfirm}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Confirm and Continue
          </button>
        </>
      )}
    </div>
  );
}

