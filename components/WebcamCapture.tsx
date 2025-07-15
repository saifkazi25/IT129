'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const capture = async () => {
    if (!cameraReady || !webcamRef.current) {
      setError('Camera not ready. Please wait or refresh.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    console.log('📸 Captured selfie');

    if (!imageSrc) {
      setError('Could not capture selfie. Please allow camera access and try again.');
      return;
    }

    try {
      setUploading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageSrc }),
      });

      const { url: selfieUrl } = await res.json();
      console.log('☁️ Uploaded to Cloudinary:', selfieUrl);

      localStorage.setItem('selfieUrl', selfieUrl);
      router.push('/result');
    } catch (err) {
      setError('Error uploading selfie. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take a Selfie</h1>

      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-md mb-4"
        onUserMedia={() => setCameraReady(true)}
        videoConstraints={{ facingMode: 'user' }}
      />

      <button
        onClick={capture}
        disabled={uploading}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {uploading ? 'Uploading...' : 'Capture & Generate'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

