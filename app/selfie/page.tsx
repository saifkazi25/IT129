'use client';

import React, { Suspense } from 'react';
import CustomWebcam from '@/components/CustomWebcam';

export default function SelfiePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-400">Loading camera...</div>}>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-black">
        <h1 className="text-2xl font-bold mb-4 text-center">Smile! Let’s capture your fantasy face 😎</h1>
        <CustomWebcam />
      </main>
    </Suspense>
  );
}
