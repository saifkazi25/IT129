'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  const [captured, setCaptured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<string[] | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  // Capture selfie
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCaptured(true);
      uploadToCloudinary(imageSrc);
    }
  }, [webcamRef]);

  // Upload selfie to Cloudinary
  const uploadToCloudinary = async (base64Image: string) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', base64Image);
      formData.append('upload_preset', 'infinite_tsukuyomi');

      const response = await fetch('https://api.cloudinary.com/v1_1/djm1jppes/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Failed to upload selfie. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Generate fantasy image after selfie is uploaded
  const handleGenerate = async () => {
    if (!imageUrl) {
      setError('Selfie upload not complete');
      return;
    }

    try {
      const storedAnswers = sessionStorage.getItem('quizAnswers');
      const parsedAnswers = storedAnswers ? JSON.parse(storedAnswers) : null;

      if (!parsedAnswers || !Array.isArray(parsedAnswers)) {
        setError('Missing quiz answers');
        return;
      }

      setQuizAnswers(parsedAnswers);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizAnswers: parsedAnswers,
          selfieUrl: imageUrl,
        }),
      });

      const { imageUrl: resultUrl } = await response.json();
      router.push(`/result?imageUrl=${encodeURIComponent(resultUrl)}`);
    } catch (err) {
      setError('Error generating fantasy image');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!captured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-md shadow-md"
          />
          <button
            onClick={capture}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          {uploading && <p className="text-yellow-500 mt-4">Uploading selfie...</p>}
          {imageUrl && (
            <img src={imageUrl} alt="Uploaded selfie" className="mt-4 w-64 h-auto rounded shadow" />
          )}
          <button
            onClick={handleGenerate}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            disabled={!imageUrl || uploading}
          >
            Generate My Fantasy
          </button>
        </>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
