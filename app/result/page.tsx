"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const quizAnswersRaw = localStorage.getItem("quizAnswers");
      const selfieUrl = localStorage.getItem("selfieUrl");

      console.log("🧠 quizAnswersRaw:", quizAnswersRaw);
      console.log("📸 selfieUrl:", selfieUrl);

      if (!quizAnswersRaw || !selfieUrl) {
        console.warn("❌ Missing required data, redirecting...", { quizAnswersRaw, selfieUrl });
        router.push("/");
        return;
      }

      const quizAnswers: string[] = JSON.parse(quizAnswersRaw);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        if (!response.ok) {
          throw new Error("Image generation failed");
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (err) {
        console.error("❌ Error generating image:", err);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      setTimeout(loadData, 1000); // delay to ensure localStorage is populated
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy World Awaits</h1>
      {loading ? (
        <p className="text-gray-600">Generating your fantasy image...</p>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Fantasy Result"
          className="max-w-full rounded-xl shadow-xl"
        />
      ) : (
        <p className="text-red-500">Failed to generate image. Please try again.</p>
      )}
    </div>
  );
}

