"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalImage = localStorage.getItem("fantasyImageUrl");

    if (finalImage) {
      setImageUrl(finalImage);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-700">Loading your fantasy world...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Image Not Found</h1>
        <p className="text-gray-700">It looks like your fantasy image is missing.</p>
        <p className="text-gray-600 mt-2">Please retake the quiz and selfie.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Fantasy Awaits</h1>
      <img
        src={imageUrl}
        alt="Your Fantasy World"
        className="rounded-2xl shadow-xl max-w-full w-[90%] md:w-[600px]"
      />
    </div>
  );
}
