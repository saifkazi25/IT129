"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setUploading(true);
    setUploadStatus("Uploading selfie...");
    setSelfiePreview(imageSrc);

    try {
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const res = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        setUploadStatus("Upload successful!");
      } else {
        console.error("Failed to upload to Cloudinary:", data);
        setUploadStatus("Upload failed.");
      }
    } catch (err) {
      console.error("Error uploading selfie:", err);
      setUploadStatus("Upload error.");
    } finally {
      setUploading(false);
    }
  };

  const goToResult = () => {
    router.push("/result");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={360}
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-md"
      />

      <button
        onClick={capture}
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : "Capture Selfie"}
      </button>

      {uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}

      {selfiePreview && (
        <img
          src={selfiePreview}
          alt="Selfie preview"
          className="w-48 h-48 object-cover rounded-lg shadow"
        />
      )}

      <button
        onClick={goToResult}
        disabled={!localStorage.getItem("selfieUrl")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded disabled:bg-gray-400"
      >
        Generate My Fantasy
      </button>
    </div>
  );
}
