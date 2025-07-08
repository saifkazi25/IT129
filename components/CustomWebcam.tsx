'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("Webcam component mounted ✅");
  }, []);

  const handleUserMedia = () => {
    console.log("Webcam access granted 🎥");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!cameraReady || !webcamRef.current) {
      console.warn("❌ Webcam not ready yet.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      console.error("🚫 Image capture failed");
      alert("Could not capture image. Please try again.");
      return;
    }

    console.log("📸 Image captured:", imageSrc.slice(0, 50)); // just preview

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', imageSrc);
    router.push(`/result?${params.toString()}`);
  }, [cameraReady, searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        onUserMedia={handleUserMedia}
        className="rounded-xl shadow"
        videoConstraints={{ facingMode: 'user' }}
      />
      <button
        onClick={capture}
        disabled={!cameraReady}
        className={`px-4 py-2 rounded-xl shadow-md transition ${
          cameraReady
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        {cameraReady ? '📷 Capture & See Your Fantasy' : '🎥 Loading Camera...'}
      </button>
    </div>
  );
}
