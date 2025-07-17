"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "null");
    const selfieUrl = localStorage.getItem("selfieUrl");

    if (!quizAnswers || !selfieUrl) {
      setError("Missing quiz answers or selfie.");
      setLoading(false);
      return;
    }

    console.log("🧠 quizAnswers from localStorage:", quizAnswers);
    console.log("📸 selfieUrl from localStorage:", selfieUrl);

    const generateFantasy = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();

        if (response.ok && data.image) {
          setFinalImage(data.image);
        } else {
          throw new Error(data.error || "Image generation failed");
        }
      } catch (err: any) {
        console.error("Error generating image:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    generateFantasy();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Infinite Tsukuyomi</h1>

      {loading && <p>✨ Generating your fantasy image, please wait...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {finalImage && (
        <img
          src={finalImage}
          alt="Your fantasy world"
          className="max-w-full rounded-lg shadow-lg border"
        />
      )}
    </div>
  );
}
