"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
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
      // Convert base64 screenshot to blob
      const blob = await (await fetch(screenshot)).blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const res = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.secure_url) throw new Error("Upload failed");

      const selfieUrl = data.secure_url;
      localStorage.setItem("selfieUrl", selfieUrl);

      setUploadStatus("Upload complete! Redirecting...");
      
      setTimeout(() => {
        router.push("/result");
      }, 1500); // Add a short delay to let user see the "complete" message
    } catch (err) {
      console.error(err);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-md"
      />

      {selfiePreview && (
        <img
          src={selfiePreview}
          alt="Selfie preview"
          className="mt-4 w-64 rounded-md border"
        />
      )}

      <button
        onClick={capture}
        disabled={uploading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Capture Selfie & Generate"}
      </button>

      {uploadStatus && (
        <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
      )}
    </div>
  );
}
