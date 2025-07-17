"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture selfie. Please try again.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      const blob = await (await fetch(imageSrc)).blob();
      formData.append("file", blob);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const cloudName = "djm1jppes";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await axios.post(uploadUrl, formData);
      const selfieUrl = response.data.secure_url;

      localStorage.setItem("selfieUrl", selfieUrl);
      router.push("/result");
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Capture Your Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-lg"
        videoConstraints={{ facingMode: "user", width: 640, height: 480 }}
      />
      <button
        onClick={capture}
        disabled={uploading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Capture and Continue"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
