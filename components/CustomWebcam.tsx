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

      console.log("Captured image base64 start:", imageSrc?.substring(0, 100));

      if (!imageSrc) {
        console.warn("Screenshot not ready, retrying...");
        setTimeout(tryCapture, 300); // retry in 300ms
        return;
      }

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
