"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ResultPage() {
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
        const selfieUrl = localStorage.getItem("selfieUrl");

        if (!quizAnswers.length || !selfieUrl) {
          console.error("Missing data");
          return;
        }

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => (prev < 90 ? prev + Math.floor(Math.random() * 5) + 1 : prev));
        }, 500);

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();
        clearInterval(progressInterval);
        setProgress(100); // fill bar
        setMergedImageUrl(data.mergedImageUrl || null);
      } catch (err) {
        console.error("❌ Error loading image", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 800); // add slight delay for smooth UX
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
      {loading ? (
        <div className="text-center">
          <h2 className="text-xl mb-4 font-semibold">Generating your fantasy world...</h2>
          <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">{progress}%</p>
        </div>
      ) : mergedImageUrl ? (
        <div>
          <Image
            src={mergedImageUrl}
            alt="Fantasy Image"
            width={512}
            height={512}
            className="rounded-xl border mt-6"
          />
        </div>
      ) : (
        <p className="text-red-400">❌ Failed to generate image. Try again.</p>
      )}
    </div>
  );
}
