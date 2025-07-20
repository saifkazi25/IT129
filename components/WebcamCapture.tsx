"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<typeof Webcam | null>(null); // ✅ FIXED TYPE
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return alert("Failed to capture selfie.");

    setUploading(true);
    setUploadStatus("Uploading selfie...");

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djm1jppes/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.secure_url) throw new Error("Upload failed");

      localStorage.setItem("selfieUrl", data.secure_url);

      setUploadStatus("Upload successful!");
      router.push("/result");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload selfie. Try again.");
    } finally {
      setUploading(false);
    }
  }, [webcamRef, router]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-xl border shadow"
      />
      <button
        onClick={capture}
        disabled={uploading}
        className={`px-4 py-2 rounded text-white ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {uploading ? "Uploading..." : "Capture & Generate My Fantasy"}
      </button>
      {uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
}
