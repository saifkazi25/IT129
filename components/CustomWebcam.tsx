'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function CustomWebcam() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        localStorage.setItem('selfieImage', imageSrc);
        router.push('/result');
      } else {
        alert('Failed to capture selfie. Try again.');
      }
    }
  };

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>
      {ready ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
            className="rounded-lg shadow-lg"
          />
          <button
            onClick={capturePhoto}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
          >
            Capture & Continue
          </button>
        </>
      ) : (
        <p>Loading camera...</p>
      )}
    </main>
  );
}
