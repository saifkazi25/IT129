'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef(null); // Temporarily use 'any' to avoid TS issues
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserMedia = () => {
    console.log("✅ Webcam ready");
    setCameraReady(true);
  };

  const capture = useCallback(() => {
    console.log("🔍 Capture function triggered", { cameraReady, ref: webcamRef.current });

    if (!cameraReady || !webcamRef.current) {
      alert("Camera not ready yet.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    console.log("📸 Captured image:", imageSrc?.slice(0, 50));

    if (!imageSrc) {
      alert("Could not capture image. Please try again.");
      return;
    }

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
        width={320}
        height={240}
        onUserMedia={handleUserMedia}
        className="rounded-xl shadow-md"
        videoConstraints={{ facingMode: "user" }}
      />
      <button
        onClick={capture}
        disabled={!cameraReady}
        className={`px-4 py-2 rounded-xl text-white shadow-md transition ${
          cameraReady ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {cameraReady ? "📷 Capture & See Your Fantasy" : "🎥 Loading Camera..."}
      </button>
    </div>
  );
}
