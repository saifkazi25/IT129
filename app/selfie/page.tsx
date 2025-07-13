'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const webcamRef = useRef<Webcam | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAnswers = localStorage.getItem('quizAnswers');
    if (storedAnswers) {
      setQuizAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  const capture = () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      if (screenshot) setImage(screenshot);
    }
  };

  const generateImage = async () => {
    if (!image || !quizAnswers) return;
    setLoading(true);
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ image, quizAnswers }),
    });
    const data = await response.json();
    localStorage.setItem('fantasyImage', data.image);
    router.push('/result');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white text-black">
      {!image ? (
        <>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg" />
          <button onClick={capture} className="bg-black text-white px-4 py-2 rounded">Capture Selfie</button>
        </>
      ) : (
        <>
          <img src={image} alt="Captured" className="rounded-lg w-64 h-auto" />
          <button onClick={generateImage} className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? 'Generating...' : 'Enter the Fantasy'}
          </button>
        </>
      )}
    </div>
  );
}

