"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      alert("Failed to capture selfie. Please try again.");
      return;
    }

    console.log("📸 Captured image:", imageSrc);

    try {
      setUploading(true);
      console.log("⬆️ Uploading to Cloudinary...");

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", imageSrc);
      formData.append("upload_preset", "infinite_tsukuyomi"); // Your upload preset
      formData.append("cloud_name", "djm1jppes"); // Your cloud name

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/djm1jppes/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await cloudinaryRes.json();
      const cloudinaryUrl = uploadResult.secure_url;

      console.log("☁️ Cloudinary response:", uploadResult);
      console.log("🌐 Cloudinary URL:", cloudinaryUrl);

      if (!cloudinaryUrl) {
        throw new Error("Cloudinary upload failed or returned no URL.");
      }

      // Get quiz answers from localStorage
      const storedAnswers = localStorage.getItem("quizAnswers");
      const quizAnswers = storedAnswers ? JSON.parse(storedAnswers) : null;

      console.log("✅ Retrieved quizAnswers from localStorage:", quizAnswers);

      // Final validation
      if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
        throw new Error("Invalid or missing quiz answers.");
      }

      // Debug log: Final payload
      console.log("🧪 Final payload to /api/generate:", {
        quizAnswers,
        selfieDataUrl: cloudinaryUrl,
      });

      // Send to API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizAnswers,
          selfieDataUrl: cloudinaryUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ /api/generate failed:", error);
        alert(`Image generation failed: ${error.error}`);
        return;
      }

      const data = await response.json();
      const finalImageUrl = data.mergedImageUrl;

      console.log("🌟 Final merged image URL:", finalImageUrl);

      localStorage.setItem("finalImageUrl", finalImageUrl);
      router.push("/result");
    } catch (err) {
      console.error("🔥 Error during selfie + quiz processing:", err);
      alert("Something went wrong! Check the console for details.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="rounded-xl shadow-md"
      />
      <button
        onClick={capture}
        disabled={uploading}
        className="px-6 py-3 rounded-2xl bg-black text-white font-semibold shadow-md hover:bg-gray-800 disabled:opacity-50"
      >
        {uploading ? "Processing..." : "Capture & Continue"}
      </button>
    </div>
  );
}
