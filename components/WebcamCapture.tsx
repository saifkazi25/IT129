'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import type { WebcamProps } from 'react-webcam'; // ✅ Only import props type
import type { MutableRefObject } from 'react';    // ✅ Also import ref type

export default function WebcamCapture() {
  const webcamRef = useRef<MutableRefObject<Webcam | null>>(null); // ✅ Fix type properly
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const capture = () => {
    const imageSrc = webcamRef.current?.current?.getScreenshot(); // ✅ add `.current` again
    if (!imageSrc) {
      setError('Could not capture selfie. Please try again.');
      return;
    }

    try {
      localStorage.setItem('selfie', imageSrc);
      router.push('/result');
    } catch (err) {
      setError('Error saving selfie. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef as any} // ✅ cast as any to avoid strict typing issues
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-md mb-4"
        videoConstraints={{
          facingMode: 'user',
        }}
      />
      <button
        onClick={capture}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Capture & Generate'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
