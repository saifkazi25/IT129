'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserMedia = () => {
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        localStorage.setItem('selfie', imageSrc);

        const answers = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`) || '');
        localStorage.setItem('answers', JSON.stringify(answers));

        router.push('/result');
      }
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        onUserMedia={handleUserMedia}
        className="rounded-lg border border-gray-300 w-[320px] h-[240px]"
      />
      <button
        onClick={capture}
        disabled={!cameraReady}
        className={`px-6 py-2 rounded-lg font-bold text-white ${
          cameraReady ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {cameraReady ? '📸 Capture Selfie' : 'Loading Camera...'}
      </button>
    </div>
  );
}
