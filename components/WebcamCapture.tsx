'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('⚠️ Could not capture image. Please allow camera access.');
      return;
    }

    // ✅ Store selfie in localStorage
    localStorage.setItem('selfie', imageSrc);
    router.push('/result');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Capture Your Selfie</h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 720,
          height: 720,
          facingMode: 'user',
        }}
        className="rounded-xl shadow-md"
      />

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <button
        onClick={capture}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg"
      >
        ✅ Capture & Continue
      </button>

      <button
        onClick={() => {
          localStorage.removeItem('quizAnswers');
          window.location.href = '/';
        }}
        className="mt-3 text-blue-600 underline"
      >
        🔁 Restart Quiz
      </button>
    </main>
  );
}
