'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const webcamRef = useRef<ReactWebcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      localStorage.setItem('selfie', screenshot);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const quizData = JSON.parse(localStorage.getItem('quizData') || '{}');

      const formData = new FormData();
      formData.append('image', dataURItoBlob(image));
      formData.append('prompt', JSON.stringify(quizData));

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      localStorage.setItem('fantasyImage', result.fantasyImage);
      localStorage.setItem('mergedImage', result.mergedImage);
      router.push('/result');
    } catch (err) {
      console.error('Error submitting selfie:', err);
    } finally {
      setLoading(false);
    }
  };

  const dataURItoBlob = (dataURI: string): Blob => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">📸 Take a Selfie</h1>

      {!image ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-md border"
          />
          <button
            onClick={capture}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Capture
          </button>
        </>
      ) : (
        <>
          <img src={image} alt="Captured selfie" className="rounded-md border w-64 h-auto" />
          <button
            onClick={() => setImage(null)}
            className="mt-2 px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Retake
          </button>
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className={`mt-6 px-6 py-2 rounded text-white ${
          loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Generating...' : 'Submit & Generate'}
      </button>
    </div>
  );
}

// 👇 This is required to fix the TS error about Webcam ref
type ReactWebcam = React.ElementRef<typeof Webcam>;
