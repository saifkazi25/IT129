'use client';

import React, { useRef, useCallback } from 'react';
import Webcam, { WebcamProps } from 'react-webcam';
import type { Webcam as WebcamComponent } from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<WebcamComponent | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      console.log("Webcam ref is null");
      alert("Webcam not ready yet.");
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();
    console.log("Captured image:", screenshot);

    if (!screenshot) {
      alert("Could not capture selfie. Please try again.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', screenshot);

    console.log("Redirecting with params:", params.toString());
    router.push(`/result?${params.toString()}`);
  }, [webcamRef, router, searchParams]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        className="rounded-xl shadow"
        videoConstraints={{
          width: 320,
          height: 240,
          facingMode: 'user',
        }}
      />
      <button
        onClick={capture}
        className="px-4 py-2 bg-black text-white rounded-xl shadow-md hover:bg-gray-800 transition"
      >
        Capture & See Your Fantasy
      </button>
    </div>
  );
}
