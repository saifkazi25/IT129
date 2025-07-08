'use client';

import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null); // FIXED: Use 'any' to avoid type error
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();

    if (!screenshot) {
      console.error("❌ No image captured.");
      alert("Failed to capture image. Try again.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', screenshot);
    router.push(`/result?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        className="rounded border border-gray-300 shadow-md"
      />
      <button
        onClick={capture}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Capture & Continue
      </button>
    </div>
  );
}
