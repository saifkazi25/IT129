/* app/selfie/page.tsx */
'use client';

import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import react-webcam (avoids SSR issues)
const Webcam = dynamic(() => import('react-webcam'), { ssr: false });

export default function SelfiePage() {
  const webcamRef = useRef<any>(null);        // ✅ useRef<any> fixes TS error
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Pull quiz answers from URL
  const quizAnswers: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const ans = searchParams.get(`q${i}`);
    if (ans) quizAnswers.push(ans);
  }

  /** Capture the webcam frame as a base64 JPEG */
  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) setImgSrc(imageSrc);
  };

  /** Send selfie + quiz answers to backend */
  const generateFantasy = async () => {
    if (!imgSrc || quizAnswers.length < 7) {
      alert('Missing selfie or answers');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selfieImage: imgSrc,
          quizAnswers,
        }),
      });

      const data = await res.json();
      if (data.image) {
        router.push(`/result?img=${encodeURIComponent(data.image)}`);
      } else {
        alert(data.error || 'Generation failed');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {!imgSrc ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: 'user' }}
          />
          <button
            onClick={capture}
            className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={imgSrc} alt="Captured" className="rounded-xl w-64 mb-4" />
          <button
            onClick={generateFantasy}
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Creating your fantasy...' : 'Generate Fantasy Image'}
          </button>
          <button
            onClick={() => setImgSrc(null)}
            className="mt-2 text-sm underline text-gray-600"
          >
            Retake
          </button>
        </>
      )}
    </div>
  );
}
