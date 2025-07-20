"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const capture = async () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();

    if (!screenshot) {
      setError("Unable to capture image. Please try again.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      const blob = await (await fetch(screenshot)).blob();
      formData.append("file", blob);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/djm1jppes/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryData.secure_url) {
        throw new Error("Cloudinary upload failed.");
      }

      localStorage.setItem("selfieUrl", cloudinaryData.secure_url);
      router.push("/result");
    } catch (err: any) {
      setError("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Take Your Selfie</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-md shadow-md"
      />

      <button
        onClick={capture}
        disabled={uploading}
        className={`mt-4 px-6 py-2 text-white rounded ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {uploading ? "Uploading..." : "Capture & Continue"}
      </button>

      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
}
