"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export default function SelfiePage() {
  const webcamRef = useRef(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract quiz answers from URL
  const quizAnswers: string[] = [];
  for (let i = 1; i <= 7; i++) {
    const val = searchParams.get(`q${i}`);
    if (val) quizAnswers.push(val);
  }

  const capture = () => {
    if (webcamRef.current) {
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      setSelfie(imageSrc);
    }
  };

  const handleGenerate = async () => {
    if (!selfie || quizAnswers.length < 7) {
      alert("Missing selfie or answers");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selfieImage: selfie,
        quizAnswers,
      }),
    });

    const data = await res.json();
    if (data.image) {
      router.push(`/result?img=${encodeURIComponent(data.image)}`);
    } else {
      alert("Failed to generate image.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {!selfie ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-xl border mb-4"
            videoConstraints={{ facingMode: "user" }}
          />
          <button
            onClick={capture}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <>
          <img src={selfie} alt="Captured selfie" className="rounded-xl w-64 mb-4" />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
          >
            {loading ? "Creating your fantasy..." : "Generate Fantasy Image"}
          </button>
        </>
      )}
    </div>
  );
}


