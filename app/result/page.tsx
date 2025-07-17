"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      const quizAnswersRaw = localStorage.getItem("quizAnswers");
      const selfieUrl = localStorage.getItem("selfieUrl");

      if (!quizAnswersRaw || !selfieUrl) {
        setError("Missing quiz answers or selfie.");
        setLoading(false);
        router.push("/");
        return;
      }

      try {
        const quizAnswers = JSON.parse(quizAnswersRaw);
        console.log("🧠 quizAnswers from localStorage:", quizAnswers);
        console.log("📸 selfieUrl from localStorage:", selfieUrl);

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        if (!response.ok) {
          throw new Error("API failed to generate image.");
        }

        const data = await response.json();
        setImageUrl(data.output?.[0] || null);
      } catch (err: any) {
        console.error("❌ Error generating image:", err);
        setError("Failed to generate image. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Delay ensures localStorage is ready
    setTimeout(fetchResult, 300);
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
        <p className="text-xl font-semibold">🔮 Generating your fantasy world...</p>
        <p className="mt-2 text-gray-500">Please wait. This may take 30–60 seconds.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-red-600 p-4">
        <h2 className="text-2xl font-bold mb-2">⚠️ Error</h2>
        <p>{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Go Back to Start
        </button>
      </div>
    );
  }

  // ✅ This is where the JSX must be correctly wrapped and returned
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy World Awaits</h1>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Fantasy Result"
          className="max-w-full rounded-xl shadow-xl"
        />
      ) : (
        <p>No image received.</p>
      )}
    </div>
  );
}
