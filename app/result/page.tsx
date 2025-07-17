"use client";

import React, { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const storedAnswers = localStorage.getItem("quizAnswers");
        const storedSelfieUrl = localStorage.getItem("selfieUrl");

        console.log("🧠 quizAnswers from localStorage:", storedAnswers);
        console.log("📸 selfieUrl from localStorage:", storedSelfieUrl);

        if (!storedAnswers || !storedSelfieUrl) {
          setError("Missing quiz answers or selfie. Please restart the experience.");
          return;
        }

        const quizAnswers = JSON.parse(storedAnswers);

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizAnswers,
            selfieUrl: storedSelfieUrl,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong.");
          return;
        }

        setImageUrl(data.image);
        setLoading(false);
      } catch (err) {
        console.error("Error generating image:", err);
        setError("An unexpected error occurred.");
      }
    };

    fetchImage();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center text-red-600 text-center p-4">
        <h1 className="text-3xl font-bold mb-4">✨ Your Fantasy Awaits</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-xl">✨ Summoning your dream world...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">✨ Here is Your Fantasy</h1>
      {imageUrl && <img src={imageUrl} alt="Fantasy Result" className="rounded-xl shadow-lg w-[90%] max-w-2xl" />}
    </main>
  );
}
