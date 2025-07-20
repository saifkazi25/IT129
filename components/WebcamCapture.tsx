"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [selfieUploadedUrl, setSelfieUploadedUrl] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfiePreview(imageSrc);
      uploadImage(imageSrc);
    }
  }, []);

  const uploadImage = async (base64Image: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", "infinite_tsukuyomi");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/djm1jppes/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        localStorage.setItem("selfieUrl", data.secure_url);
        setSelfieUploadedUrl(data.secure_url);
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      alert("Upload error.");
    } finally {
      setUploading(false);
    }
  };

  const goToResult = () => {
    router.push("/result");
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-semibold mb-4">Capture Your Selfie</h1>

      {!selfiePreview && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg shadow-md"
          videoConstraints={{ facingMode: "user" }}
        />
      )}

      {selfiePreview && (
        <img
          src={selfiePreview}
          alt="Captured selfie"
          className="rounded-lg shadow-md mb-4 max-w-xs"
        />
      )}

      <div className="mt-4">
        {!selfiePreview && (
          <button
            onClick={capture}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Capture Selfie
          </button>
        )}

        {selfiePreview && uploading && (
          <p className="text-yellow-600 font-semibold">Uploading selfie... please wait</p>
        )}

        {selfieUploadedUrl && !uploading && (
          <button
            onClick={goToResult}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Generate My Fantasy
          </button>
        )}

        {!selfieUploadedUrl && selfiePreview && !uploading && (
          <p className="text-red-600 mt-2">Upload failed or still pending...</p>
        )}
      </div>
    </div>
  );
}
