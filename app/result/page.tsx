"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const answers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
    const selfieUrl = localStorage.getItem("selfieUrl");

    console.log("🧠 quizAnswers:", answers);
    console.log("🖼️ selfieUrl:", selfieUrl);

    if (!answers.length || !selfieUrl) {
      console.warn("⚠️ Missing quiz answers or selfie URL. Retrying in 100ms...");
      setTimeout(() => {
        const retryAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const retrySelfie = localStorage.getItem("selfieUrl");

        console.log("🔁 Retried:");
        console.log("quizAnswers:", retryAnswers);
        console.log("selfieUrl:", retrySelfie);

        if (!retryAnswers.length || !retrySelfie) {
          setError("Missing quiz answers or selfie. Please restart the experience.");
          setLoading(false);
          return;
        }

        sendToBackend(retryAnswers, retrySelfie);
      }, 100);
    } else {
      sendToBackend(answers, selfieUrl);
    }
  }, [ready]);

  const sendToBackend = async (answers: string[], selfieUrl: string) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizAnswers: answers,
          selfieDataUrl: selfieUrl,
        }),
      });

      const data = await response.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        throw new Error("No image returned");
      }
    } catch (err: any) {
      console.error("❌ API Error:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">✨ Your Fantasy Awaits</h1>
      {loading ? (
        <p>Generating your dream... ⏳</p>
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
