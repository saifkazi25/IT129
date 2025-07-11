"use client";

import Webcam from "react-webcam";
import { useRef } from "react";

export default function CustomWebcam({ onCapture }: { onCapture: (img: string) => void }) {
  const webcamRef = useRef<Webcam | null>(null);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    } else {
      alert("Could not capture image.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        className="rounded shadow-lg"
        videoConstraints={{ facingMode: "user" }}
      />
      <button
        onClick={capture}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Capture Selfie
      </button>
    </div>
  );
}





