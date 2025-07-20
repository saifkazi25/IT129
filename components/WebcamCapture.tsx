"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<string[] | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  useEffect(() => {
    const storedAnswers = localStorage.getItem("quizAnswers");
    if (storedAnswers) {
      setQuizAnswers(JSON.parse(storedAnswers));
    } else {
      router.push("/");
    }
  }, [router]);

  const capture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setUploading(true);
    setUploadStatus("Uploading selfie...");

    try {
      const formData = new FormData();
      const blob = await (await fetch(imageSrc)).blob();
      formData.append("file", blob);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        setSelfiePreview(data.secure_url);
        setUploadStatus("Selfie uploaded!");
      } else {
        setUploadStatus("Upload failed. Try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleContinue = () => {
    router.push("/result");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Step 2: Capture Your Selfie</h1>

      {!selfiePreview ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-md mb-4"
          />
          <button
            onClick={capture}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Capture Selfie"}
          </button>
        </>
      ) : (
        <>
          <img src={selfiePreview} alt="Selfie preview" className="w-64 h-auto rounded shadow mb-4" />
          <p className="text-green-600 mb-2">{uploadStatus}</p>
          <button
            onClick={handleContinue}
            disabled={!selfiePreview || uploading}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Generate My Fantasy
          </button>
        </>
      )}
    </div>
  );
}
