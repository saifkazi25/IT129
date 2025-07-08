'use client';

import React, { useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

// Dynamically import react-webcam (avoids server-side issues)
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // Temporarily use `any` to bypass TS errors
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const queryString = searchParams.toString();
      router.push(`/result?${queryString}&selfie=${encodeURIComponent(imageSrc)}`);
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-lg w-full max-w-sm"
      />
      <button
        onClick={capture}
        className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition"
      >
        Generate My Fantasy Image
      </button>
    </div>
  );
}
