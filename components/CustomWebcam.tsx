'use client';

import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<Webcam>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const handleUserMedia = () => setReady(true);

  const capture = useCallback(() => {
    if (!ready || !webcamRef.current) return;

    const dataUrl = webcamRef.current.getScreenshot();
    if (!dataUrl) {
      alert('Could not capture image, please retry.');
      return;
    }

    localStorage.setItem('selfieImage', dataUrl); // store selfie
    router.push('/result');                       // go show result
  }, [ready, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        ref={webcamRef}
        onUserMedia={handleUserMedia}
        audio={false}
        mirrored
        screenshotFormat="image/jpeg"
        className="rounded-xl shadow"
        videoConstraints={{ facingMode: 'user', width: 320, height: 240 }}
      />

      <button
        onClick={capture}
        disabled={!ready}
        className={`px-4 py-2 rounded-xl shadow transition ${
          ready
            ? 'bg-black text-white hover:bg-gray-800'
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        {ready ? '📷 Capture Selfie' : '🎥 Loading Camera...'}
      </button>
    </div>
  );
}
