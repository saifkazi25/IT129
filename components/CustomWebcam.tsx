'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    if (!cameraReady) {
      alert("Camera not ready. Please wait a few seconds.");
      return;
    }

    const tryCapture = () => {
      const imageSrc = webcamRef.current?.getScreenshot();

      if (!imageSrc) {
        console.warn("Screenshot not ready, retrying...");
        setTimeout(tryCapture, 300);
        return;
      }

      console.log("Image captured:", imageSrc.substring(0, 100));
      const params = new URLSearchParams(searchParams.toString());
      params.set('image', imageSrc);
      router.push(`/result?${params.toString()}`);
    };

    tryCapture();
  }, [cameraReady, searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        className="rounded-xl shadow"
        onUserMedia={() => {
          console.log("Webcam ready");
          setCameraReady(true);
        }}
        onUserMediaError={(err) => {
          console.error("Webcam error:", err);
          alert("Please allow camera access.");
        }}
        videoConstraints={{
          width: 640,
          height: 480,
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
