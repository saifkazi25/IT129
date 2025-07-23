"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const selfieUrl = localStorage.getItem("selfieUrl");

        if (!quizAnswers.length || !selfieUrl) {
          console.error("Missing data");
          return;
        }

        // Start a fake progress bar animation
        let interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 95) return prev;
            return prev + 1 + Math.random(); // smoother
          });
        }, 120);

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();
        clearInterval(interval);
        setProgress(100); // complete bar
        setMergedImageUrl(data.mergedImageUrl || null);
      } catch (err) {
        console.error("❌ Error loading image", err);
      } finally {
        setTimeout(() => setLoading(false), 1000); // small delay for smooth transition
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {loading ? (
        <div className="text-center w-full max-w-md">
          <h2 className="text-xl mb-4 font-semibold">Generating your fantasy world...</h2>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">{Math.floor(progress)}%</p>
        </div>
      ) : mergedImageUrl ? (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">✨ Your Fantasy Image is Ready!</h2>
          <img
            src={mergedImageUrl}
            alt="Fantasy Image"
            width={512}
            height={512}
            className="rounded-xl border mt-4"
          />
        </div>
      ) : (
        <p className="text-red-400">❌ Failed to generate image. Try again.</p>
      )}
    </div>
  );
}
