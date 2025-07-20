"use client";

import dynamic from "next/dynamic";

const WebcamCapture = dynamic(() => import("../../components/WebcamCapture"), { ssr: false });

export default function SelfiePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">🧙 Upload Your Selfie</h1>
      <WebcamCapture />
    </div>
  );
}
