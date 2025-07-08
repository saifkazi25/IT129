'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null); // ✅ Fixed type
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserMedia = () => {
    console.log("✅ Webcam ready");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    console.log("🟡 Button clicked");
    if (!webcamRef.current) {
      console.warn("❌ Webcam ref is null");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      console.warn("❌ Could not capture image");
      return;
    }

    console.log("📸 Captured image", imageSrc.slice(0, 50));

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', imageSrc);
    router.push(`/result?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        onUserMedia={handleUserMedia}
        onUserMediaError={(err) => console.error("Webcam error:", err)}
        width={320}
        height={240}
        className="rounded-xl shadow"
        videoConstraints={{ facingMode: 'user' }}
      />
      <button
        onClick={capture}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-800 transition"
      >
        📷 Take Selfie
      </button>
    </div>
  );
}
