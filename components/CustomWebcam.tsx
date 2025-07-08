'use client';

import React, { useRef } from 'react';
import Webcam, { WebcamProps } from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam | null>(null); // ✅ FIXED
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    console.log('Captured image:', imageSrc);

    if (!imageSrc) {
      alert("Couldn't capture image. Try again.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', imageSrc);

    console.log('Redirecting with params:', params.toString());

    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        className="rounded-xl shadow"
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
