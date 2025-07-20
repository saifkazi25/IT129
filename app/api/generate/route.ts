"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("Preparing your fantasy image...");

  useEffect(() => {
    const generateImage = async () => {
      const storedAnswers = localStorage.getItem("quizAnswers");
      const storedSelfieUrl = localStorage.getItem("selfieUrl");

      if (!storedAnswers || !storedSelfieUrl) {
        setStatus("Missing data. Redirecting...");
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      try {
        setStatus("Generating your fantasy...");

        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizAnswers: JSON.parse(storedAnswers),
            selfieUrl: storedSelfieUrl,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const data = await response.json();

        if (data.image) {
          setImageUrl(data.image);
          setStatus("Your fantasy is ready!");
        } else {
          throw new Error("No image returned");
        }
      } catch (err) {
        console.error("Generation Error:", err);
        setStatus("Something went wrong. Please try again.");
      }
    };

    generateImage();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Infinite Tsukuyomi Result</h1>
      <p className="text-gray-600 mb-4">{status}</p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated Fantasy"
          className="w-full max-w-lg rounded-lg shadow-lg border"
        />
      )}
    </div>
  );
}
