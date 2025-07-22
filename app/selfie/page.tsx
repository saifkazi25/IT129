'use client';

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SelfiePage() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);

    try {
      const uploadRes = await axios.post(
        `https://api.cloudinary.com/v1_1/djm1jppes/image/upload`,
        {
          file: imageSrc,
          upload_preset: 'infinite_tsukuyomi',
        }
      );

      const uploadedUrl = uploadRes.data.secure_url;
      setSelfieUrl(uploadedUrl);

      // Submit both answers and selfie to result
      const payload = { quizAnswers, selfieUrl: uploadedUrl };

      const result = await axios.post('/api/generate', payload);

      if (result.data?.finalImageUrl) {
        router.push(`/result?img=${encodeURIComponent(result.data.finalImageUrl)}`);
      } else {
        alert('Failed to generate image.');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error uploading or generating:', err);
      alert('Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Take Your Selfie</h1>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded shadow-lg w-full max-w-md"
      />
      <button
        onClick={capture}
        disabled={loading}
