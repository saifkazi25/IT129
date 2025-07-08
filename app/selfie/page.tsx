'use client'

import WebcamCapture from '@/components/WebcamCapture';

export default function SelfiePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">📸 Take a Selfie</h1>
      <WebcamCapture />
    </main>
  );
}
