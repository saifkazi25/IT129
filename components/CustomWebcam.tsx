'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null); // Type-safe can be added later
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserMedia = () => {
    console.log("✅ Webcam ready");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    console.log("🟡 Capture clicked");
    if (!cameraReady || !webcamRef.current) {
      console.warn("❌ Webcam not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert("❌ Could not capture image.");
      return;
    }

    console.log("📸 Image captured:", imageSrc.slice(0, 50));

    // Manually extract all quiz answers from searchParams (not .toString())
    const q0 = searchParams.get('q0') ?? '';
    const q1 = searchParams.get('q1') ?? '';
    const q2 = searchParams.get('q2') ?? '';
    const q3 = searchParams.get('q3') ?? '';
    const q4 = searchParams.get('q4') ?? '';
    const q5 = searchParams.get('q5') ?? '';
    const q6 = searchParams.get('q6') ?? '';

    const params = new URLSearchParams();
    params.set('q0', q0);
    params.set('q1', q1);
    params.set('q2', q2);
    params.set('q3', q3);
    params.set('q4', q4);
    params.set('q5', q5);
    params.set('q6', q6);
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
        onUserMediaError={(err) => console.error("Webcam error:", err)}
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
