"use client";

import React, { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

// TypeScript now sees react-webcam as “any”, so this is safe
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

export default function WebcamCapture() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webcamRef = useRef<any>(null);
  const [capturing, setCapturing] = useState(false);

  const capture = useCallback(() => webcamRef.current?.getScreenshot(), []);

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
    } catch {
      alert("Error generating image");
      setCapturing(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={we
