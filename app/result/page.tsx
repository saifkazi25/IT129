"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function ResultPage() {
  const params = useSearchParams();
  const imageUrl = params.get("imageUrl");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy World Awaits</h1>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Fantasy Result"
          className="max-w-full rounded-xl shadow-xl"
        />
      ) : (
        <p className="text-red-500">No image found. Please try again.</p>
      )}
    </div>
  );
}
