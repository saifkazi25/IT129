"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<React.RefObject<Webcam> | null>(null);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const captureAndUpload = useCallback(async () => {
    const screenshot = webcamRef.current?.current?.getScreenshot();
    if (!screenshot) {
      alert("Failed to capture selfie. Try again.");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading selfie...");

    try {
      const formData = new FormData();
      formData.append("file", screenshot);
      formData.append("upload_preset", "infinite_tsukuyomi");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/djm1jppes/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        setUploadStatus("Upload complete! Redirecting...");
        router.push("/result");
      } else {
        throw new Error("Upload failed. No secure_url returned.");
      }
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      alert("Failed to upload selfie. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Capture Your Selfie</h1>
      <Webcam
        audio={false}
        ref={webcamRef as any}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-lg shadow-md"
      />
      <button
        onClick={captureAndUpload}
        disabled={uploading}
        className={`mt-4 px-6 py-2 rounded-lg font-semibold transition text-white ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {uploading ? "Uploading Selfie..." : "Capture & Generate My Fantasy"}
      </button>
      {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
}
