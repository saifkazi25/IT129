"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  "What's the environment of your dream world?",
  "Pick a dream destination.",
  "What role would you play in that world?",
  "What outfit do you imagine yourself in?",
  "Pick a landscape you'd love to explore.",
  "What theme best matches your fantasy?",
  "One magical ability you’d want?"
];

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check all questions are answered
    if (answers.some((a) => a.trim() === "")) {
      alert("Please answer all questions.");
      return;
    }

    // Store in localStorage
    localStorage.setItem("quizAnswers", JSON.stringify(answers));

    // Navigate to selfie page
    router.push("/selfie");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {questions.map((question, idx) => (
        <div key={idx} className="flex flex-col">
          <label className="mb-2 font-semibold">{question}</label>
          <input
            type="text"
            value={answers[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="border rounded p-2"
            required
          />
        </div>
      ))}

      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      >
        Next → Take Selfie
      </button>
    </form>
  );
}
