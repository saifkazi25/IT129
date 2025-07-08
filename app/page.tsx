'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const CustomWebcam = dynamic(() => import('@/components/CustomWebcam'), { ssr: false });

export default function SelfiePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">Step 3: Take Your Selfie</h1>
      <Suspense fallback={<p className="text-gray-500">Loading webcam...</p>}>
        <CustomWebcam />
      </Suspense>
    </main>
  );
}
