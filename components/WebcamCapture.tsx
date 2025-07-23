'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert('Failed to capture selfie. Please try again.');
      return;
    }

    console.log('📸 Captured image:', imageSrc);
    setUploading(true);

    try {
      // Upload to Cloudinary
      console.log('⬆️ Uploading to Cloudinary...');
      const formData = new FormData();
      formData.append('file', imageSrc);
      formData.append('upload_preset', 'infinite_tsukuyomi');

      const cloudinaryRes = await fetch(
        'https://api.cloudinary.com/v1_1/djm1jppes/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await cloudinaryRes.json();
      console.log('☁️ Cloudinary response:', result);

      const cloudinaryUrl = result.secure_url;
      console.log('🌐 Cloudinary URL:', cloudinaryUrl);

      // Save selfieUrl to localStorage
      localStorage.setItem('selfieUrl', cloudinaryUrl);
      const savedUrl = localStorage.getItem('selfieUrl');

      if (savedUrl) {
        console.log('✅ selfieUrl saved:', savedUrl);
        router.push('/result');
      } else {
        console.error('❌ Failed to save selfieUrl');
        alert('Something went wrong saving your selfie. Please try again.');
      }
    } catch (err) {
      console.error('❌ Error uploading selfie to Cloudinary:', err);
      alert('Error uploading selfie. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [webcamRef, router]);

  return (
    <div className="flex flex-col items-center mt-10">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-md border shadow-md mb-4"
      />
      <button
        onClick={capture}
        disabled={uploading}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        {uploading ? 'Uploading...' : 'Capture & Continue'}
      </button>
    </div>
  );
}
