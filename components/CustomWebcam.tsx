'use client';

import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam | null>(null); // ✅ Updated type
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();

    if (!screenshot) {
      console.error("❌ Failed to capture screenshot.");
      alert("Could not capture image. Please try again.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', screenshot);

    console.log("✅ Captured and navigating with image param:", screenshot.slice(0, 50) + '...');

    router.push(`/result?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-lg border border-gray-400 shadow-md"
        width={320}
        height={240}
      />
      <button
        onClick={capture}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Capture & Continue
      </button>
    </div>
  );
}
