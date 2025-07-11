'use client';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

const CustomWebcam: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [error, setError] = useState("");

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      localStorage.setItem("selfieImage", imageSrc);
      router.push("/result");
    } else {
      setError("Failed to capture image. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={320}
        videoConstraints={{ facingMode: "user" }}
      />
      <button onClick={capture} className="bg-green-600 text-white px-6 py-2 rounded">
        Capture & View Result
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default CustomWebcam;

