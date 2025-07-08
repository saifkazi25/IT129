'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      localStorage.setItem('selfie', imageSrc);
      router.push('/result');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={() => setReady(true)}
        className="rounded-lg border border-gray-300"
      />
      <button
        onClick={capture}
        disabled={!ready}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        Capture Selfie
      </button>
    </div>
  );
}
