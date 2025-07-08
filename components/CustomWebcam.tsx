'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();

  const handleUserMedia = () => {
    console.log("✅ Webcam ready");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    if (!cameraReady || !webcamRef.current) {
      alert("Webcam not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Could not capture image.");
      return;
    }

    // Store image in localStorage
    localStorage.setItem("selfie", imageSrc);
    router.push("/result");
  }, [cameraReady, router]);

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
