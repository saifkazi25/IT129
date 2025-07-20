"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    console.log("📸 capture() triggered");
    setCaptured(true);

    setTimeout(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      console.log("📸 Captured image:", imageSrc);

      if (!imageSrc) {
        setError("⚠️ Failed to capture selfie. Screenshot is null.");
        setCaptured(false);
        return;
      }

      console.log("⬆️ Uploading to Cloudinary...");

      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      })
        .then(async res => {
          console.log("🌐 Cloudinary raw response:", res);
          const data = await res.json();
          console.log("☁️ Cloudinary parsed JSON:", data);

          if (!data.secure_url) {
            setError("❌ Cloudinary upload failed. secure_url missing.");
            setCaptured(false);
            return;
          }

          const selfieUrl = data.secure_url;
          const quiz = localStorage.getItem("quizAnswers");

          if (!quiz) {
            setError("❌ Missing quiz answers.");
            setCaptured(false);
            return;
          }

          const payload = {
            quizAnswers: JSON.parse(quiz),
            selfieUrl,
          };

          console.log("📦 Sending to /api/generate:", payload);

          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const result = await response.json();

          if (result.outputUrl) {
            localStorage.setItem("fantasyImageUrl", result.outputUrl);
            router.push("/result");
          } else {
            setError("❌ Image generation failed.");
            setCaptured(false);
          }
        })
        .catch(err => {
          console.error("❌ Cloudinary upload or API call failed:", err);
          setError("⚠️ Something went wrong. See console.");
          setCaptured(false);
        });
    }, 500);
  }, [router]);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraReady(true);
      } catch {
        setError("❌ Camera access denied.");
      }
    };
    checkCamera();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {cameraReady ? (
        <>
          {!captured && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded-xl shadow-md"
              />
              <button
                onClick={capture}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl shadow"
              >
                📸 Capture Selfie
              </button>
            </>
          )}
          {captured && <p className="text-green-600 mt-4">Uploading & generating image...</p>}
        </>
      ) : (
        <p className="text-gray-700 text-lg mt-10">Loading camera...</p>
      )}
    </div>
  );
}
