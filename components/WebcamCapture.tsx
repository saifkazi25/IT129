"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import uploadToCloudinary from "../utils/cloudinary";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;

    setLoading(true);
    setError("");

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setError("Could not capture image.");
        setLoading(false);
        return;
      }

      // Upload to Cloudinary
      const uploadedUrl = await uploadToCloudinary(imageSrc);

      // Save selfie URL in localStorage
      localStorage.setItem("selfieUrl", uploadedUrl);
      console.log("✅ Selfie uploaded to Cloudinary:", uploadedUrl);

      router.push("/result");
    } catch (err: any) {
      console.error("Error uploading selfie:", err);
      setError("Failed to upload selfie.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg shadow-md"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
      />
      <button
        onClick={capture}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Capture & Continue"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
