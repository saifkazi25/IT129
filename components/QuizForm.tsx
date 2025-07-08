"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

export default function QuizForm() {
  const [answers, setAnswers] = useState(Array(7).fill(""));
  const [selfie, setSelfie] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const router = useRouter();

  const questions = [
    "What time of day do you feel most alive?",
    "Pick a place you’d teleport to right now",
    "Choose a character archetype you vibe with",
    "What are you wearing in your dream world?",
    "Pick a backdrop for your fantasy life",
    "Your fantasy life is mostly about…",
    "Pick a superpower just for fun",
  ];

  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const captureSelfie = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setSelfie(img);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) {
      alert("Please take a selfie first!");
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, image: selfie }),
    });

    const data = await response.json();
    if (data?.imageUrl) {
      router.push(`/result?url=${encodeURIComponent(data.imageUrl)}`);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">✨ Build Your Fantasy</h1>

        {questions.map((q, i) => (
          <div key={i}>
            <label className="block font-semibold mb-2">{q}</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={answers[i]}
              onChange={(e) => handleAnswerChange(i, e.target.value)}
              required
            />
          </div>
        ))}

        <div className="text-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="mx-auto rounded"
          />
          <button
            type="button"
            onClick={captureSelfie}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            📸 Capture Selfie
          </button>
        </div>

        {selfie && (
          <div className="text-center mt-4">
            <p className="mb-2 font-semibold">Selfie Preview:</p>
            <img src={selfie} alt="Captured" className="mx-auto rounded shadow-md" />
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700"
          >
            🚀 See My Fantasy
          </button>
        </div>
      </form>
    </div>
  );
}

