"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const questions = [
  "What kind of landscape do you dream of?",
  "Which city feels most like home in your dreams?",
  "What kind of character do you see yourself as?",
  "What outfit are you wearing?",
  "What’s the vibe of your dream world?",
  "What kind of story is unfolding around you?",
  "Do you have any supernatural powers or abilities?"
];

export default function QuizForm() {
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    router.push("/selfie");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
      {questions.map((q, i) => (
        <div key={i}>
          <label className="block mb-1 font-medium text-lg">{q}</label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        Next: Take a Selfie
      </button>
    </form>
  );
}


