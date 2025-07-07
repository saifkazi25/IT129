"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "You’re alone in a strange city at midnight. What do you do first?",
    options: [
      "Find the highest rooftop",
      "Follow the lights and music",
      "Wander until something calls you",
      "Ask a stranger what this place hides",
    ],
  },
  {
    id: 2,
    question: "What kind of silence do you crave most?",
    options: [
      "The silence after a storm",
      "The silence before the truth drops",
      "The silence of outer space",
      "The silence of someone finally understanding you",
    ],
  },
  {
    id: 3,
    question: "Which of these words *feels* like your vibe right now?",
    options: ["Reckless", "Untouchable", "Fading", "Becoming", "Dangerous"],
  },
  {
    id: 4,
    question: "One door leads to your real self. What material is it made of?",
    options: ["Frosted glass", "Old, cracked stone", "Mirror shards", "Smoke", "Neon light"],
  },
  {
    id: 5,
    question: "People see you as ___. But deep down, you know you’re ___.",
    options: [
      "Kind / unstoppable",
      "Quiet / calculating",
      "Chill / burning",
      "Wild / lost",
      "Smart / alone",
    ],
  },
  {
    id: 6,
    question: "What’s your secret fuel?",
    options: ["Longing", "Rage", "Hope", "Obsession", "Love you can’t explain"],
  },
  {
    id: 7,
    question: "If your life had a background track right now, it would be…",
    options: [
      "Echoes in a cathedral",
      "Bass in a locked room",
      "A whisper in a tunnel",
      "A violin in reverse",
      "No music. Just breath.",
    ],
  },
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

    const unanswered = answers.find((a) => !a);
    if (unanswered) {
      alert("Please answer all the questions before continuing.");
      return;
    }

    const params = new URLSearchParams();
    answers.forEach((answer, index) => {
      params.append(`q${index + 1}`, answer);
    });

    router.push(`/selfie?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h1 className="text-2xl font-bold text-center">Let’s Begin</h1>

      {questions.map((q, index) => (
        <div key={q.id}>
          <p className="font-semibold text-lg mb-3">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((option) => (
              <label key={option} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`q${index + 1}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleChange(index, option)}
                  className="mr-2"
                  required
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
      >
        Next →
      </button>
    </form>
  );
}
