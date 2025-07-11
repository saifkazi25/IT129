"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

type Props = {
  onCapture: (dataUrl: string) => void;
};

const CustomWebcam = ({ onCapture }: Props) => {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
      setCaptured(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-md"
        width={300}
        videoConstraints={{
          facingMode: "user",
        }}
      />
      {!captured && (
        <button
          onClick={capture}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Capture Selfie
        </button>
      )}
    </div>
  );
};

export default CustomWebcam;




