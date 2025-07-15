"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
      const selfieDataUrl = localStorage.getItem("selfieDataUrl");

      console.log("✅ Incoming quizAnswers:", quizAnswers);
      console.log("✅ Incoming selfieDataUrl:", selfieDataUrl);

      if (!quizAnswers || quizAnswers.length !== 7 || !selfieDataUrl) {
        console.error("❌ Missing input data", { quizAnswers, selfieDataUrl });
        setError("Missing quiz answers or selfie. Please go back and try again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: quizAnswers, selfie: selfieDataUrl }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const data = await response.json();
        console.log("✅ Response from backend:", data);
        setFinalImage(data.finalImageUrl);
      } catch (err: any) {
        console.error("❌ Error during generation", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateImage();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-black bg-white">
      <h1 className="text-3xl font-bold mb-6">🌀 Your Infinite Tsukuyomi</h1>

      {loading && <p>Generating your fantasy image...</p>}

      {error && (
        <div className="text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {!loading && finalImage && (
        <img src={finalImage} alt="Fantasy Result" className="max-w-full h-auto mt-6 rounded-lg shadow-lg" />
      )}
    </div>
  );
}
