'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomWebcam from '@/components/CustomWebcam';

export default function SelfiePage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (imageData) {
      localStorage.setItem('selfieImage', imageData);
      router.push('/result');
    }
  }, [imageData, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-white text-black">
      <h1 className="text-3xl font-bold">📸 Take a Selfie</h1>
      <CustomWebcam onCapture={setImageData} />
    </main>
  );
}

