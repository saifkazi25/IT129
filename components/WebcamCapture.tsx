"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    setUploading(true);
    setUploadStatus("Uploading selfie...");
    setSelfiePreview(screenshot);

    try {
      const formData = new FormData();
      formData.append("file", screenshot);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const res = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      const uploadedUrl = data.secure_url;
      localStorage.setItem("selfieUrl", uploadedUrl);

      setUploadStatus("Upload successful! Redirecting...");
      setTimeout(() => {
        router.push("/result");
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-lg"
      />

      {selfiePreview && (
        <img
          src={selfiePreview}
          alt="Selfie preview"
          className="mt-4 rounded-lg w-64 h-auto"
        />
      )}

      <button
        onClick={capture}
        disabled={uploading}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Capture Selfie & Generate"}
      </button>

      {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
}
