"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const answers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
    const selfie = localStorage.getItem("selfie");

    if (!answers.length || !selfie) {
      console.error("❌ Missing quiz answers or selfie");
      setError("Missing data. Please complete the quiz and selfie again.");
      setLoading(false);
      return;
    }

    console.log("✅ Sending data to backend:", { answers, selfie });

    const generateImage = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizAnswers: answers,
            selfieDataUrl: selfie,
          }),
        });

        const data = await response.json();

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error("No image returned");
        }
      } catch (err: any) {
        console.error("❌ Image generation error:", err);
        setError("Failed to generate image. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">🧠 Your Fantasy World</h1>
      {loading ? (
        <p>Generating your image... ⏳</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <img
          src={imageUrl}
          alt="Generated Fantasy"
          className="max-w-full rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}
