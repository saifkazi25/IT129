"use client";

import { useSearchParams } from "next/navigation";

export default function ResultDisplay() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  if (!url) {
    return (
      <div className="text-center text-red-600 p-4">
        ❌ No image URL found. Please try the quiz again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🌈 Your Fantasy Revealed</h1>
      <img src={url} alt="Generated Fantasy" className="rounded shadow-xl max-w-full" />
      <p className="mt-4 text-lg">Save or share your dream world!</p>
    </div>
  );
}

