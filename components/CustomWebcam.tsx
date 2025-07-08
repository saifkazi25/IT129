'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const markReady = () => {
    console.log("✅ Webcam is ready!");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!cameraReady || !webcamRef.current) {
      alert("Camera not ready.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Failed to capture image.");
      return;
    }

    console.log("📸 Captured Image:", imageSrc.slice(0, 50));

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', imageSrc);
    router.push(`/result?${params.toString()}`);
  }, [cameraReady, searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        onUserMedia={markReady}
        onLoadedMetadata={markReady}
        width={320}
        height={240}
        className="rounded-xl shadow-lg"
      />
      <button
        onClick={capture}
        disabled={!cameraReady}
        className={`px-4 py-2 text-white rounded-xl transition shadow-md ${
          cameraReady ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {cameraReady ? '📷 Capture & See Your Fantasy' : '🎥 Loading Camera...'}
      </button>
    </div>
  );
}
