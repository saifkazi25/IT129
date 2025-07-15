"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false); // wait for hydration

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const tryGetData = async () => {
      let answers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
      let selfie = localStorage.getItem("selfie");

      console.log("🧪 Initial read:");
      console.log("📋 quizAnswers:", answers);
      console.log("📷 selfieDataUrl:", selfie?.substring(0, 100));

      if (!answers.length || !selfie) {
        console.warn("⏱ Waiting 100ms to retry selfie read...");
        await new Promise((res) => setTimeout(res, 100)); // wait 100ms
        answers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        selfie = localStorage.getItem("selfie");

        console.log("🔁 Retried read:");
        console.log("📋 quizAnswers:", answers);
        console.log("📷 selfieDataUrl:", selfie?.substring(0, 100));
      }

      if (!answers.length || !selfie) {
        console.error("❌ Missing quiz answers or selfie");
        setError("Missing data. Please complete the quiz and selfie again.");
        setLoading(false);
        return;
      }

      console.log("✅ Sending to backend:", { answers, selfie });

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizAnswers: answers, selfieDataUrl: selfie }),
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

    tryGetData();
  }, [ready]);

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
