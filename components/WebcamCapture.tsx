"use client";

import React, { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export default function WebcamCapture() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return null;
    return webcamRef.current.getScreenshot();
  }, []);

  const handleCapture = async () => {
    const img = capture();
    if (!img) return;
    setCapturing(true);

    const answers = Object.fromEntries(searchParams.entries());

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, selfie: img }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        router.push(`/result?image=${encodeURIComponent(data.imageUrl)}`);
      } else {
        alert(data.error || "Generation failed");
        setCapturing(false);
      }
    } catch (err) {
      alert("Error generating image");
      setCapturing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded border"
        videoConstraints={{ facingMode: "user" }}
      />
      <button
        onClick={handleCapture}
        disabled={capturing}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {capturing ? "Generating..." : "Capture & Generate"}
      </button>
    </div>
  );
}
