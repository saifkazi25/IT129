"use client";

import React, { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter, useSearchParams } from "next/navigation";

export default function CustomWebcam() {
  const webcamRef = useRef<any>(null); // 👈 safer for now
  const router = useRouter();
  const searchParams = useSearchParams();

  const capture = () => {
    if (
      webcamRef.current &&
      typeof webcamRef.current.getScreenshot === "function"
    ) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("image", imageSrc);
        router.push(`/result?${params.toString()}`);
      } else {
        alert("Selfie failed. Couldn't capture image. Try again.");
      }
    } else {
      alert("Camera is not ready. Please allow access or refresh the page.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold mb-4">📸 Take a Selfie</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-lg w-full max-w-sm"
        videoConstraints={{
          facingMode: "user",
        }}
      />
      <button
        onClick={capture}
        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
      >
        Generate My Fantasy Image
      </button>
    </div>
  );
}
