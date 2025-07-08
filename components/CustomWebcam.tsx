'use client';

import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      console.error("❌ Webcam ref not ready");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    console.log("📸 Image captured:", imageSrc);

    if (!imageSrc) {
      alert("❌ Couldn't capture image. Try again.");
      return;
    }

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
        width={320}
        height={240}
        className="rounded-xl shadow"
        videoConstraints={{
          facingMode: "user"
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
