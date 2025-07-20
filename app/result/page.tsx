"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");
      const selfieUrl = localStorage.getItem("selfieUrl");

      if (!quizAnswers.length || !selfieUrl) {
        setError("Missing quiz answers or selfie. Please go back and try again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();
        console.log("🖼 Generated image result:", data);

        const returnedUrl =
          data.imageUrl ||
          data.output ||
          (Array.isArray(data) && typeof data[0] === "string" ? data[0] : null);

        if (!returnedUrl) {
          throw new Error("Image generation failed. No URL returned.");
        }

        setImageUrl(returnedUrl);
      } catch (err: any) {
        console.error("❌ Image generation error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  const handleRetry = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Your Infinite Tsukuyomi</h1>

      {loading && <p className="text-lg animate-pulse">Generating your fantasy world...</p>}

      {error && (
        <div className="text-red-500 text-center space-y-4">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && imageUrl && (
        <div className="flex flex-col items-center">
          <Image
            src={imageUrl}
            alt="Your fantasy world"
            width={512}
            height={512}
            className="rounded-lg shadow-lg mb-4"
          />
          <button
            onClick={handleRetry}
            className="mt-4 bg-white text-black px-6 py-2 rounded hover:bg-gray-200"
          >
            Create Another
          </button>
        </div>
      )}
    </div>
  );
}
