'use client';

import React, { Suspense } from 'react';
import CustomWebcam from '@/components/CustomWebcam';

function WebcamWrapper() {
  return <CustomWebcam />;
}

export default function SelfiePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">Step 3: Capture Your Selfie</h1>
      <Suspense fallback={<p>Loading camera...</p>}>
        <WebcamWrapper />
      </Suspense>
    </main>
  );
}
