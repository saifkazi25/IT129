'use client';

import { Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Webcam from 'react-webcam';

function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      alert("Could not capture selfie.");
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('image', imageSrc);
    router.push(`/result?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded-xl shadow-lg"
        width={320}
        height={240}
      />
      <button
        onClick={capture}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Capture Selfie & Continue
      </button>
    </div>
  );
}

export default function SelfiePage() {
  return (
    <Suspense fallback={<p>Loading camera...</p>}>
      <WebcamCapture />
    </Suspense>
  );
}
