"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function WebcamCapture() {
  const webcamRef = useRef<typeof Webcam | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      setError("Could not capture image. Please try again.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      const blob = await fetch(screenshot).then((res) => res.blob());

      formData.append("file", blob);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const cloudName = "djm1jppes";
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        console.log("✅ Uploaded selfie to Cloudinary:", data.secure_url);
        router.push("/result");
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("❌ Error uploading selfie:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-xl border border-gray-300"
      />
      <button
        onClick={capture}
        disabled={uploading}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {uploading ? "Uploading..." : "Capture & Continue"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
