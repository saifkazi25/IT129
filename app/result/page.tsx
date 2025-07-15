"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
    const selfieUrl = localStorage.getItem("selfieUrl");

    console.log("✅ Incoming quizAnswers:", quizAnswers);
    console.log("✅ Incoming selfieUrl:", selfieUrl);

    if (!quizAnswers.length || !selfieUrl) {
      setError("Missing quiz answers or selfie. Please retake the quiz.");
      setLoading(false);
      return;
    }

    const sendToBackend = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizAnswers,
            selfieUrl,
          }),
        });

        const data = await response.json();

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
        } else {
          throw new Error("No image returned from backend");
        }
      } catch (err) {
        console.error("❌ Backend error:", err);
        setError("Something went wrong while generating your fantasy image.");
      } finally {
        setLoading(false);
      }
    };

    sendToBackend();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Fantasy World</h1>

      {loading ? (
        <p>Generating your image... ⏳</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
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
