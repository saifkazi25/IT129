"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResultDisplay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const image = searchParams.get("image");

  return (
    <div className="p-6 flex flex-col items-center space-y-6">
      <h2 className="text-3xl font-bold text-center">🌌 Your Fantasy Unlocked</h2>
      {image ? (
        <img src={image} alt="Fantasy Result" className="rounded-lg max-w-full" />
      ) : (
        <p>No image generated.</p>
      )}
      <button
        onClick={() => router.push("/")}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Start Over
      </button>
    </div>
  );
}
