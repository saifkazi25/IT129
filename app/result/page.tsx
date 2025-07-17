"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateFantasy = async () => {
      try {
        const storedQuiz = localStorage.getItem("quizAnswers");
        const storedSelfie = localStorage.getItem("selfieUrl");

        const quizAnswers = storedQuiz ? JSON.parse(storedQuiz) : null;
        const selfieUrl = storedSelfie ?? null;

        console.log("🧠 quizAnswers from localStorage:", quizAnswers);
        console.log("📸 selfieUrl from localStorage:", selfieUrl);

        if (!quizAnswers || !Array.isArray(quizAnswers) || !selfieUrl) {
          setError("Missing quiz answers or selfie. Please restart the experience.");
          return;
        }

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        if (!res.ok) {
          throw new Error("Image generation failed.");
        }

        const data = await res.json();
        setFantasyImage(data.image);
      } catch (err: any) {
        console.error("❌ Generation error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    generateFantasy();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">✨ Your Fantasy Awaits</h1>

      {loading && <p className="text-lg">Summoning your fantasy...</p>}

      {error && (
        <p className="text-red-500 text-center max-w-md">
          {error}
        </p>
      )}

      {fantasyImage && (
        <div className="mt-6">
          <Image
            src={fantasyImage}
            alt="Fantasy Image"
            width={512}
            height={512}
            className="rounded-xl shadow-lg"
          />
        </div>
      )}
    </main>
  );
}
