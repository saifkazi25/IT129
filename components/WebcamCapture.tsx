"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<any>(null);
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const handleCapture = async () => {
    setError("");
    setLoading(true);
    console.log("✅ Capture button clicked");

    const imageSrc = webcamRef.current?.getScreenshot();
    console.log("📸 Captured image:", imageSrc);

    if (!imageSrc) {
      setError("No image captured. Please try again.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", imageSrc);
    formData.append("upload_preset", "infinite_tsukuyomi");

    try {
      console.log("⬆️ Uploading to Cloudinary...");
      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/djm1jppes/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();
      console.log("☁️ Cloudinary response:", cloudData);

      if (!cloudData.secure_url) {
        setError("Cloudinary upload failed. Try again.");
        setLoading(false);
        return;
      }

      const selfieUrl = cloudData.secure_url;
      const quiz = localStorage.getItem("quizAnswers");

      if (!quiz) {
        setError("Missing quiz answers. Please restart the quiz.");
        setLoading(false);
        return;
      }

      const payload = {
        quizAnswers: JSON.parse(quiz),
        selfieUrl,
      };

      console.log("📦 Sending to /api/generate:", payload);

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!genRes.ok) {
        const errorDetails = await genRes.json();
        console.error("❌ /api/generate failed:", errorDetails);
        setError(
          errorDetails?.error ||
            "Image generation failed. Please try again later."
        );
        setLoading(false);
        return;
      }

      const genData = await genRes.json();
      console.log("🖼 Generated image result:", genData);

      if (genData.outputUrl) {
        localStorage.setItem("fantasyImageUrl", genData.outputUrl);
        router.push("/result");
      } else {
        setError("Image generation failed. No URL returned.");
      }
    } catch (err) {
      console.error("❌ Error in upload/generate flow:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-xl shadow-md"
      />

      <button
        onClick={handleCapture}
        disabled={loading}
        className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl shadow disabled:opacity-50"
      >
        {loading ? "🧠 Generating..." : "📸 Capture Selfie"}
      </button>

      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
    </div>
  );
}
