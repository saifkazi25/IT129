"use client";

import React, { useEffect, useState } from "react";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      const storedQuizAnswers = localStorage.getItem("quizAnswers");
      const storedSelfieUrl = localStorage.getItem("selfieUrl");

      if (!storedQuizAnswers || !storedSelfieUrl) {
        console.warn("Missing quiz answers or selfie URL");
        setLoading(false);
        return;
      }

      try {
        const quizAnswers = JSON.parse(storedQuizAnswers);

        console.log("✅ Retrieved quizAnswers from localStorage:", quizAnswers);
        console.log("🖼️ Retrieved selfieUrl from localStorage:", storedSelfieUrl);

        const payload = {
          quizAnswers,
          selfieUrl: storedSelfieUrl,
        };

        console.log("🧪 Final payload to /api/generate:", payload);

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("🌟 Final merged image URL:", data.mergedImageUrl);

        if (data.mergedImageUrl) {
          setMergedImageUrl(data.mergedImageUrl);
        }
      } catch (error) {
        console.error("🔥 Error during selfie + quiz processing:", error);
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Infinite Tsukuyomi</h1>

      {loading ? (
        <p className="text-lg">✨ Creating your fantasy...</p>
      ) : mergedImageUrl ? (
        <img
          src={mergedImageUrl}
          alt="Final fantasy image"
          className="max-w-full rounded-xl shadow-xl"
        />
      ) : (
        <p className="text-red-500 text-lg">
          No image found. Please go back and complete the quiz.
        </p>
      )}
    </div>
  );
}
