"use client";

import React, { useState } from "react";
import CustomWebcam from "@/components/CustomWebcam";
import { useRouter } from "next/navigation";

export default function SelfiePage() {
  const [selfie, setSelfie] = useState<string | null>(null);
  const router = useRouter();

  const handleCapture = (dataUrl: string) => {
    setSelfie(dataUrl);
    localStorage.setItem("selfie", dataUrl);
  };

  const handleSubmit = () => {
    router.push("/result");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">📸 Capture Your Selfie</h1>
      <CustomWebcam onCapture={handleCapture} />
      {selfie && (
        <>
          <img src={selfie} alt="Captured Selfie" className="my-4 w-48 h-48 object-cover rounded-full" />
          <button
            onClick={handleSubmit}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit & See Your Fantasy
          </button>
        </>
      )}
    </main>
  );
}


