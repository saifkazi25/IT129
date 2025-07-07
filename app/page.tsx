'use client';

import WebcamCapture from '@/components/WebcamCapture';

export default function SelfiePage() {
  const handleCapture = (image: string) => {
    console.log("Captured image:", image);
    // TODO: Save to state, localStorage or send to backend
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <WebcamCapture onCapture={handleCapture} />
    </main>
  );
}
