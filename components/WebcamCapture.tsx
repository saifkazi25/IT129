"use client";

import React, { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { WebcamProps } from "react-webcam";
import { useRouter, useSearchParams } from "next/navigation";

const Webcam = dynamic(
  () => import("react-webcam").then((mod) => mod.default as any),
  { ssr: false }
) as unknown as React.FC<WebcamProps>;

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
