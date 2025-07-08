'use client';
import { useRef, useState } from 'react';
import ReactWebcam from 'react-webcam'; // ✅ renamed import
import { useRouter } from 'next/navigation';

export default function CustomWebcam() {
  const webcamRef = useRef<ReactWebcam | null>(null); // ✅ use correct type
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      localStorage.setItem('selfieImage', imageSrc);
      router.push('/result');
    } else {
      alert('Failed to capture image.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <ReactWebcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        onUserMedia={() => setReady(true)}
        className="rounded border"
      />
      <button
        onClick={capture}
        disabled={!ready}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Capture & See Fantasy
      </button>
    </div>
  );
}
