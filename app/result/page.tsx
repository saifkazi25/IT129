"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMergedImage = async () => {
      const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
      const selfieUrl = localStorage.getItem("selfieUrl");

      if (!quizAnswers.length || !selfieUrl) {
        setError("Missing quiz answers or selfie");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Something went wrong");
        } else {
          setMergedImageUrl(data.mergedImageUrl);
        }
      } catch (err) {
        setError("Failed to connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchMergedImage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      {loading ? (
        <p className="text-xl animate-pulse">🔮 Summoning your fantasy...</p>
      ) : error ? (
        <p className="text-red-400 text-lg">{error}</p>
      ) : (
        mergedImageUrl && (
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold mb-2">🌟 Welcome to your fantasy</h2>
            <img src={mergedImageUrl} alt="Merged Fantasy" className="rounded-xl max-w-full max-h-[80vh] shadow-lg" />
            <a
              href={mergedImageUrl}
              download="your_fantasy.jpg"
              className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              ⬇️ Download Image
            </a>
          </div>
        )
      )}
    </div>
  );
}
