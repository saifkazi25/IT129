'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<React.ElementRef<typeof Webcam>>(null);
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleCapture = async () => {
    // ⬇️  cast to any so TS knows getScreenshot exists
    const selfie = (webcamRef.current as any)?.getScreenshot();

    if (!selfie) {
      setError('Could not capture selfie.');
      return;
    }

    const answersRaw = localStorage.getItem('quizAnswers');
    if (!answersRaw) {
      router.push('/');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizAnswers: JSON.parse(answersRaw),
          image: selfie,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const { mergedImage } = awa
