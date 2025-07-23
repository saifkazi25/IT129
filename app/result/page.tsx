"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const selfieUrl = localStorage.getItem("selfieUrl");

        console.log("📥 quizAnswers:", quizAnswers);
        console.log("📥 selfieUrl:", selfieUrl);

        if (!quizAnswers.length || !selfieUrl) {
          setError("Missing quiz answers or selfie.");
          return;
        }

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();
        console.log("🧠 Response from /api/generate:", data);

        if (!response.ok || !data.mergedImageUrl) {
          setError("Image generation failed. Please try again.");
          return;
        }

        setMergedImageUrl(data.mergedImageUrl);
      } catch (err) {
        console.error("❌ Error fetching merged image:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {loading ? (
        <div className="text-center">
          <h2 className="text-xl mb-4 font-semibold">Generating your fantasy world...</h2>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 animate-pulse" style={{ width: "100%" }} />
          </div>
        </div>
      ) : error ? (
        <p className="text-red-400 mt-6">❌ {error}</p>
      ) : mergedImageUrl ? (
        <div>
          <Image
            src={mergedImageUrl}
            alt="Your Fantasy World"
            width={512}
            height={512}
            className="rounded-xl border mt-6"
          />
        </div>
      ) : null}
    </div>
  );
}
