"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam, { Webcam as WebcamComponent } from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<WebcamComponent | null>(null);
  const router = useRouter();
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState("");
  const [captured, setCaptured] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCaptured(true);

        // Upload to Cloudinary (or handle locally)
        const formData = new FormData();
        formData.append("file", imageSrc);
        formData.append("upload_preset", "infinite_tsukuyomi");

        fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
          method: "POST",
          body: formData,
        })
          .then(res => res.json())
          .then(data => {
            localStorage.setItem("selfieUrl", data.secure_url);
            router.push("/result");
          })
          .catch(err => {
            console.error("Upload failed:", err);
            setError("Failed to upload selfie. Please try again.");
            setCaptured(false);
          });
      }
    }
  }, [router]);

  useEffect(() => {
    const handleCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraReady(true);
      } catch (err) {
        setError("Camera access denied. Please allow camera access.");
      }
    };

    handleCameraPermission();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {error && <p className="text-red-600">{error}</p>}

      {cameraReady ? (
        <>
          {!captured && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="rounded-xl shadow-md"
              />
              <button
                onClick={capture}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl shadow"
              >
                Capture Selfie
              </button>
            </>
          )}
          {captured && <p className="text-green-600 mt-4">Uploading selfie...</p>}
        </>
      ) : (
        <p>Loading camera...</p>
      )}
    </div>
  );
}
