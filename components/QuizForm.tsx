"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export type Answers = {
  q1: string;
};

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({ q1: "" });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const search = new URLSearchParams(answers as Record<string, string>).toString();
    router.push(`/selfie?${search}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">✨ What's Your Fantasy?</h2>

      <div>
        <label className="block font-medium mb-1">Choose a world</label>
        <select
          name="q1"
          value={answers.q1}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select</option>
          <option value="sci-fi">🚀 Sci‑Fi Galaxy</option>
          <option value="medieval">⚔️ Medieval Fantasy</option>
          <option value="cyberpunk">🌆 Cyberpunk City</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Next: Take Selfie
      </button>
    </form>
  );
}
