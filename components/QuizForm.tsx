"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

export default function QuizForm() {
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));
  const [selfie, setSelfie] = useState<string | null>(null);
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null);
  const router = useRouter();

  const questions = [
    "What's the overall mood or vibe you crave most?",
    "Pick a dream destination:",
    "What kind of character are you in your fantasy?",
    "What would you wear in that world?",
    "What's the main setting or environment?",
    "What’s the core theme of your world?",
    "What supernatural element would be fun?",
  ];

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const captureSelfie = () => {
    const img = webcamRef.current?.getScreenshot?.();
    if (img) setSelfie(img);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) {
      alert("Please capture your selfie first.");
      return;
    }

    const params = new URLSearchParams();
    answers.forEach((ans, i) => params.append(`q${i}`, ans));
    params.append("image", selfie);
    router.push(`/result?${params.toString()}`);
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">✨ Build Your Fantasy</h1>

        {questions.map((q, idx) => (
          <div key={idx}>
            <label className="block mb-2 font-semibold">{q}</label>
            <input
              type="text"
              value={answers[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
        ))}

        <div className="my-4 text-center">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />
          <button
            type="button"
            onClick={captureSelfie}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            📸 Capture Selfie
          </button>
          {selfie && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Your Selfie:</p>
              <img src={selfie} alt="Captured Selfie" className="rounded shadow-md" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-green-600 text-white font-bold rounded"
        >
          🌌 Show Me My Fantasy
        </button>
      </form>
    </div>
  );
}
