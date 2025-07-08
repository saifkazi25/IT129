'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null); // ✅ FIXED: removed type issue
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserMedia = () => {
    console.log("✅ Webcam ready");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!cameraReady || !webcamRef.current) {
      console.warn("❌ Webcam not ready or null");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Could not capture image.");
      return;
    }

    console.log("📸 Image captured:", imageSrc.slice(0, 50)); // preview

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
        onUserMedia={handleUserMedia}
        width={320}
        height={240}
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

