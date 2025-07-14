'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [error, setError] = useState('');

  const captureAndContinue = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setError('Could not capture selfie. Check camera permissions.');
      return;
    }

    // 💾 store latest selfie (base64)
    localStorage.setItem('selfie', imageSrc);

    // go generate result
    router.push('/result');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white text-black p-4">
      <h1 className="text-2xl font-bold">📸 Capture Your Selfie</h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user', width: 720, height: 720 }}
        className="rounded-xl shadow-md"
      />

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={captureAndContinue}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Capture &amp; See Result
      </button>

      <button
        onClick={() => {
          localStorage.clear();
          router.push('/');
        }}
        className="text-blue-600 underline mt-2"
      >
        🔁 Restart Quiz
      </button>
    </main>
  );
}
