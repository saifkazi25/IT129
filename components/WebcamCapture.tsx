'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function WebcamCapture() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null); // ✅ THIS IS THE FIX
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const capture = () => {
    if (!cameraReady || !webcamRef.current) {
      setError('Camera not ready. Please wait or refresh.');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    console.log('📸 Captured selfie:', imageSrc?.substring(0, 50));

    if (!imageSrc) {
      setError('Could not capture selfie. Please allow camera access and try again.');
      return;
    }

    try {
      localStorage.setItem('selfie', imageSrc);
      router.push('/result');
    } catch (err) {
      setError('Error saving selfie. Try again.');
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
