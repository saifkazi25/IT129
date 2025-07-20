"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  const [captured, setCaptured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selfie, setSelfie] = useState<string | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfie(imageSrc);
      setCaptured(true);
    }
  }, [webcamRef]);

  const uploadToCloudinary = async () => {
    if (!selfie) {
      setError("Please take a selfie first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selfie);
      formData.append("upload_preset", "infinite_tsukuyomi"); // Your unsigned preset
      formData.append("cloud_name", "djm1jppes"); // Your cloud name

      const res = await fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
        method: "POST",
        body: formData,
      });

      const cloudinaryData = await res.json();

      if (cloudinaryData.secure_url) {
        localStorage.setItem("selfieUrl", cloudinaryData.secure_url);
        router.push("/result");
      } else {
        setError("Failed to upload selfie. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Capture Your Selfie</h1>

      {!captured ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-lg shadow-lg mb-4"
          />
          <button
            onClick={capture}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow"
          >
            Take Selfie
          </button>
        </>
      ) : (
        <>
          <img
            src={selfie!}
            alt="Captured"
            className="rounded-lg shadow-lg mb-4 max-w-full"
          />
          <button
            onClick={uploadToCloudinary}
            disabled={uploading}
            className={`px-6 py-2 rounded-lg shadow text-white ${
              uploading ? "bg-gray-400" : "bg-green-600"
            }`}
          >
            {uploading ? "Uploading..." : "Generate My Fantasy"}
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
