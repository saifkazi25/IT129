"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [isSelfieUploaded, setIsSelfieUploaded] = useState(false);

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
    setSelfiePreview(imageSrc);
    setUploadStatus("Uploading to Cloudinary...");
    setIsSelfieUploaded(false); // Block result button

    try {
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        setUploadStatus("Upload complete ✅");
        setIsSelfieUploaded(true);
      } else {
        setUploadStatus("Upload failed ❌");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setUploadStatus("Upload error ❌");
    } finally {
      setUploading(false);
    }
  };

  const goToResult = () => {
    if (isSelfieUploaded) {
      router.push("/result");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 p-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded shadow-md w-[360px]"
      />

      <button
        onClick={capture}
        disabled={uploading}
        className={`py-2 px-6 rounded font-semibold text-white ${
          uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Capture Selfie"}
      </button>

      {uploadStatus && <p className="text-sm text-gray-600">{uploadStatus}</p>}

      {selfiePreview && (
        <img
          src={selfiePreview}
          alt="Selfie Preview"
          className="w-48 h-48 object-cover rounded border shadow"
        />
      )}

      <button
        onClick={goToResult}
        disabled={!isSelfieUploaded}
        className={`py-2 px-6 rounded font-semibold text-white ${
          isSelfieUploaded ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Generate My Fantasy
      </button>
    </div>
  );
}
