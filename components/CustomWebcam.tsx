'use client'

import { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useSearchParams, useRouter } from 'next/navigation';

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: 'user',
};

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [capturing, setCapturing] = useState(false);

  const captureAndRedirect = () => {
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    // Grab all quiz answers from searchParams
    const answers = Array.from({ length: 7 }, (_, i) =>
      searchParams.get(`q${i}`) || ''
    );

    const answersEncoded = encodeURIComponent(JSON.stringify(answers));
    const selfieEncoded = encodeURIComponent(screenshot);

    // Redirect to /result with selfie and answers
    router.push(`/result?selfie=${selfieEncoded}&answers=${answersEncoded}`);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg"
      />
      <button
        onClick={captureAndRedirect}
        className="bg-black text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800"
      >
        Generate My Fantasy
      </button>
    </div>
  );
}
