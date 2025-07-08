"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import type { Webcam as WebcamType } from "react-webcam"; // ✅ type import fixes TS error

export default function QuizForm() {
  const router = useRouter();

  // 7 blank answers to start
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));

  // base64 selfie (null until captured)
  const [selfie, setSelfie] = useState<string | null>(null);

  // webcam ref (typed correctly)
  const webcamRef = useRef<WebcamType | null>(null);

  // update a single answer
  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  // take snapshot
  const captureSelfie = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setSelfie(img);
  };

  // submit everything to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selfie) {
      alert("Please capture a selfie first!");
      return;
    }

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, image: selfie }),
    });

    if (!res.ok) {
      alert("Image generation failed. Try again.");
      return;
    }

    const { image } = await res.json();
    localStorage.setItem("generatedImage", image);
    router.push("/result");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          ✨ Build Your Fantasy
        </h1>

        {/* 7 question inputs */}
        {answers.map((answer, i) => (
          <input
            key={i}
            className="w-full border rounded p-2"
            placeholder={`Answer for Question ${i + 1}`}
            value={answer}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            required
          />
        ))}

        {/* Webcam or captured selfie */}
        {!selfie ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded border w-full max-w-sm mx-auto"
            />
            <button
              type="button"
              onClick={captureSelfie}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              📸 Capture Selfie
            </button>
          </>
        ) : (
          <img
            src={selfie}
            alt="Your Selfie"
            className="w-48 h-48 mx-auto rounded object-cover border"
          />
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded"
        >
          🌠 Generate My Fantasy
        </button>
      </form>
    </div>
  );
}
