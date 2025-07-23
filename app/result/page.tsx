"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const generate = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const selfieUrl = localStorage.getItem("selfieUrl");

        console.log("✅ Retrieved quizAnswers from localStorage:", quizAnswers);
        console.log("✅ Retrieved selfieUrl from localStorage:", selfieUrl);

        if (!quizAnswers || !selfieUrl) {
          setError("Missing quiz answers or selfie");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();

        if (response.ok && data.mergedImageUrl) {
          setMergedImageUrl(data.mergedImageUrl);
        } else {
          console.error("❌ /api/generate failed:", data);
          setError("Image generation failed");
        }
      } catch (err) {
        console.error("🔥 Unexpected error in /result:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Fantasy Image</h1>

      {loading && <p>Generating your fantasy world... 🌌</p>}

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {mergedImageUrl && (
        <img
          src={mergedImageUrl}
          alt="Your fantasy self"
          className="w-full max-w-xl mx-auto rounded-xl shadow-xl mt-4"
        />
      )}
    </div>
  );
}
