'use client';

import React, { useRef } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      alert("Couldn't capture image. Try again.");
      return;
    }

    const rawParams = searchParams?.toString() || '';
    const params = new URLSearchParams(rawParams);

    // Validate that all quiz params exist
    const hasAllAnswers = Array.from({ length: 7 }).every((_, i) =>
      params.has(`q${i}`)
    );

    if (!hasAllAnswers) {
      alert("Please complete the quiz before taking your selfie.");
      return;
    }

    params.set('image', imageSrc);
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
