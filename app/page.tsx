'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function SelfiePage() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImgSrc(imageSrc);
      }
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      {!imgSrc ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={capture}
            className="bg-black text-white py-2 px-6 rounded-xl hover:bg-gray-800"
          >
            Capture
          </button>
        </>
      ) : (
        <div>
          <img src={imgSrc} alt="Captured" className="rounded-xl border mb-4" />
          <button
            onClick={() => setImgSrc(null)}
            className="bg-gray-600 text-white py-2 px-6 rounded-xl hover:bg-gray-700"
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
}

