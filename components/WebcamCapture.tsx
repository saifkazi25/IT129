"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
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

        const formData = new FormData();
        formData.append("file", imageSrc);
        formData.append("upload_preset", "infinite_tsukuyomi");

        fetch("https://api.cloudinary.com/v1_1/djm1jppes/image/upload", {
          method: "POST",
          body: formData,
        })
          .then(res => res.json())
          .then(async data => {
            const selfieUrl = data.secure_url;
            const quiz = localStorage.getItem("quizAnswers");

            if (!quiz) {
              setError("Missing quiz answers. Please restart.");
              return;
            }

            const response = await fetch("/api/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                quizAnswers: JSON.parse(quiz),
                selfieUrl: selfieUrl,
              }),
            });

            const result = await response.json();

            if (result.outputUrl) {
              localStorage.setItem("fantasyImageUrl", result.outputUrl);
              router.push("/result");
            } else {
              setError("Image generation failed.");
              setCaptured(false);
            }
          })
          .catch(err => {
            console.error("Upload or generation failed:", err);
            setError("Something went wrong. Please try again.");
            setCaptured(false);
          });
      }
    }
  }, [router]);

  useEffect(() => {
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraReady(true);
      } catch {
        setError("Camera access denied. Please allow permission.");
      }
    };
    checkCamera();
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
          {captured && <p className="text-green-600 mt-4">Generating your fantasy world...</p>}
        </>
      ) : (
        <p>Loading camera...</p>
      )}
    </div>
  );
}
