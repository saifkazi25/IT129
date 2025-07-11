"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [resultImage, setResultImage] = useState<string | null>(null);

  useEffect(() => {
    const img = localStorage.getItem("resultImage");
    if (img) setResultImage(img);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">🌌 Your Fantasy World</h1>
      {resultImage ? (
        <img src={resultImage} alt="Generated fantasy" className="max-w-full rounded shadow-lg" />
      ) : (
        <p className="text-red-500">No result image found. Please restart the quiz.</p>
      )}
    </main>
  );
}




