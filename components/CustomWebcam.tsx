'use client';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function CustomWebcam({ onCapture }: { onCapture: (data: string) => void }) {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState(false);

  const capture = () => {
    const image = webcamRef.current?.getScreenshot();
    if (image) {
      onCapture(image);
      setCaptured(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {!captured ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded border"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={capture}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <p>✅ Selfie captured! You can proceed.</p>
      )}
    </div>
  );
}
