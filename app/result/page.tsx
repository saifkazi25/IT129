"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (res.ok && data.finalImageUrl) {
          setImageUrl(data.finalImageUrl);
        } else {
          console.error("Image generation failed:", data);
        }
      } catch (error) {
        console.error("API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-4">
      {loading ? (
        <p className="animate-pulse text-xl">🌙 Generating your Infinite Tsukuyomi...</p>
      ) : imageUrl ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Your Infinite Tsukuyomi</h1>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-6 py-3 rounded-xl text-lg font-semibold hover:bg-gray-300 transition"
          >
            View Your Infinite Tsukuyomi
          </a>
        </>
      ) : (
        <p className="text-red-500">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
