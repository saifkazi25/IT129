'use client';

import { useRef, useState } from 'react';
import Webcam from 'react-webcam'; // ✅ Correctly import Webcam
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const captureAndSubmit = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      setError('Could not capture image.');
      return;
    }

    const storedQuiz = localStorage.getItem('quizAnswers');
    if (!storedQuiz) {
      setError('Missing quiz answers.');
      router.push('/');
      return;
    }

    setUploading(true);
    setError('');

    t
