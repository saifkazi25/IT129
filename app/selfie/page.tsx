'use client';

import { Suspense } from 'react';
import CustomWebcam from '@/components/CustomWebcam';

export default function SelfiePage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading camera…</p>}>
      <div className="min-h-screen flex items-center justify-center">
        <CustomWebcam />
      </div>
    </Suspense>
  );
}
