"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const uploadToCloudinary = async (imageSrc: string): Promise<string | null> => {
    try {
      const data = new FormData();
      data.append("file", imageSrc);
      data.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔁 Replace with your preset
      data.append("cloud_name", "YOUR_CLOUD_NAME"); // 🔁 Replace with your Cloud name

      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return null;
    }
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Unable to capture image.");
      return;
    }

    setUploading(true);

    const selfieUrl = await uploadToCloudinary(imageSrc);
    if (!selfieUrl) {
      setError("Failed to upload image to Cloudinary.");
      setUploading(false);
      return;
    }

    localStorage.setItem("selfieUrl", selfieUrl);
    setUploading(false);
    router.push("/result");
  }, [router]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Take a Selfie</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={() => setCameraReady(true)}
      />

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={capture}
          disabled={!cameraReady || uploading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: uploading ? "#ccc" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {uploading ? "Uploading..." : "Capture Selfie"}
        </button>
      </div>
    </div>
  );
}
