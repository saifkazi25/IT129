"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const capture = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Failed to capture image.");
      return;
    }

    try {
      setUploading(true);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const cloudName = "djm1jppes"; // your Cloudinary cloud name
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const selfieUrl = response.data.secure_url;

      // Save to localStorage
      localStorage.setItem("selfieUrl", selfieUrl);
      console.log("✅ Saved selfieUrl to localStorage:", selfieUrl);

      // Redirect to result
      router.push("/result");
    } catch (err) {
      console.error("Selfie upload failed:", err);
      alert("Failed to upload selfie.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={capture}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Capture & Continue"}
      </button>
    </div>
  );
}
