'use client';

import React, { useRef, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SelfiePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading camera…</div>}>
      <SelfiePage />
    </Suspense>
  );
}

function SelfiePage() {
  const Webcam = dynamic(() => import('react-webcam'), { ssr: false });
  const webcamRef = useRef<any>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    const answers = Array.from({ length: 7 }, (_, i) =>
      searchParams.get(`q${i}`) ?? ''
    );

    const query = new URLSearchParams({
      img: encodeURIComponent(imageSrc),
      answers: encodeURIComponent(JSON.stringify(answers)),
    });

    router.push(`/result?${query.toString()}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
