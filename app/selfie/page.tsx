'use client';

import React, { useEffect } from 'react';
import CustomWebcam from '@/components/CustomWebcam';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SelfiePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const answers = [
      searchParams.get('q0'),
      searchParams.get('q1'),
      searchParams.get('q2'),
      searchParams.get('q3'),
      searchParams.get('q4'),
      searchParams.get('q5'),
      searchParams.get('q6'),
    ];

    if (answers.includes(null)) {
      alert("Missing some quiz answers. Please go back and try again.");
      router.push('/');
      return;
    }

    // Save answers in localStorage
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [searchParams, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📸 Take Your Selfie</h1>
      <CustomWebcam />
    </main>
  );
}

