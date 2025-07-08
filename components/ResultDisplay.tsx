"use client";
import React from "react";

type ResultDisplayProps = {
  image: string;
};

export default function ResultDisplay({ image }: ResultDisplayProps) {
  return (
    <div className="text-center p-4">
      <img
        src={image}
        alt="Generated Fantasy"
        className="mx-auto rounded shadow-lg max-w-full h-auto"
      />
      <p className="mt-4 text-lg font-semibold">Here is your fantasy world ✨</p>
    </div>
  );
}
