'use client';

import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null); // Use `any` to avoid type error
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setError('Failed to capture selfie. Please try again.');
      return;
    }

    const quizAnswersRaw = localStorage.getItem('quizAnswers');
    if (!quizAnswersRaw) {
      setError('Missing quiz answers. Please retake the quiz.');
      return router.push('/');
    }

    try {
      setUploading(true);
      setError('');

      const response = await fetch('/api/generate', {
        method: 'POST',
        head
