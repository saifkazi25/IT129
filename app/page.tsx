'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

export default function SelfiePage() {
  const webcamRef = useRef<any>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setImgSrc(imageSrc);
  };

  return (
    <div className="p-4">
      {!imgSrc ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={capture}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Capture
          </button>
        </>
      ) : (
        <img src={imgSrc} alt="Your selfie" className="rounded-xl border" />
      )}
    </div>
  );
}
