"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok && data.finalImageUrl) {
          setImageUrl(data.finalImageUrl);
        } else {
          setError(data?.error || "Something went wrong. Try again.");
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to generate image. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 text-center">
      {loading ? (
        <div className="animate-pulse text-lg">🌙 Generating your Infinite Tsukuyomi...</div>
      ) : error ? (
        <div className="text-red-400 text-lg">{error}</div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Your Infinite Tsukuyomi is Ready</h1>
          <p className="text-md">Click below to enter your dream reality:</p>
          <a
            href={imageUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-300 transition"
          >
            View Your Fantasy Image
          </a>
        </div>
      )}
    </div>
  );
}
