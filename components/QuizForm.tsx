"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const questions = [
  "What kind of weather do you love the most?",
  "Which city or world do you wish to explore?",
  "What role would you play in your fantasy world?",
  "What would you wear in that fantasy?",
  "What’s the environment like around you?",
  "What is the emotion or energy in that world?",
  "Are you flying, fighting, or floating?"
];

export default function QuizForm() {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers.some((a) => !a)) {
      alert("Please answer all questions");
      return;
    }

    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    router.push("/selfie");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="flex flex-col">
          <label className="mb-1 font-medium">{q}</label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            className="border p-2 rounded"
            placeholder="Type your answer..."
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        Continue to Selfie
      </button>
    </form>
  );
}



