'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null); // use `any` to avoid TS type errors
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserMedia = () => {
    console.log('✅ Webcam ready');
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!cameraReady || !webcamRef.current) {
      alert("Webcam is not ready yet. Try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("❌ Failed to capture image.");
      return;
    }

    console.log("📸 Image captured:", imageSrc.substring(0, 50));

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', imageSrc);
    router.push(`/result?${params.toString()}`);
  }, [cameraReady, searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        width={320}
        height={240}
        className="rounded-xl shadow border"
        videoConstraints={{ facingMode: "user" }}
      />

      <button
        onClick={capture}
        disabled={!cameraReady}
        className={`mt-4 px-4 py-2 rounded-xl text-white font-bold shadow-md transition ${
          cameraReady
            ? 'bg-black hover:bg-gray-800'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {cameraReady ? '📸 Capture & See Your Fantasy' : '🎥 Loading...'}
      </button>
    </div>
  );
}
