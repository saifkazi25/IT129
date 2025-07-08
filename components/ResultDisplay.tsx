"use client";

import { useEffect, useState } from "react";

export default function ResultDisplay() {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("generatedImage");
    if (stored) setImage(stored);
  }, []);

  if (!image)
    return (
      <p className="text-center mt-20 text-red-500">
        No result found. Go back and take the quiz first!
      </p>
    );

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <h1 className="text-3xl font-bold">🌟 Your Ultimate Fantasy 🌟</h1>
      <img
        src={image}
        alt="AI generated fantasy"
        className="max-w-full rounded-xl shadow-lg"
      />
    </div>
  );
}
