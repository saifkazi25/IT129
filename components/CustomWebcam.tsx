"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import react-webcam (client-only)
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });
// TypeScript fix: tell TS this component accepts any props
const WebcamAny = Webcam as unknown as React.ComponentType<Record<string, unknown>>;

export default function WebcamCapture() {
  const webcamRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCapture = () => {
    // @ts-ignore – we're confident webcamRef works at runtime
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const query = new URLSearchParams(searchParams as any);
      query.set("selfie", imageSrc);
      router.push(`/result?${query.toString()}`);
    } else {
      alert("Selfie failed. Please allow camera access and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <WebcamAny
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-lg w-full max-w-sm"
      />
      <button
        onClick={handleCapture}
        className="mt-4 px-6 py-2 rounded-xl bg-black text-white text-lg font-semibold hover:bg-gray-800"
      >
        Generate My Fantasy Image
      </button>
    </div>
  );
}
