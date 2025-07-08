"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>([
    "", "", "", "", "", "", ""
  ]);
  const [selfie, setSelfie] = useState<string | null>(null);
  const webcamRef = useRef<InstanceType<typeof Webcam> | null>(null);

  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setSelfie(img);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) return alert("Please take a selfie!");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, image: selfie }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("generatedImage", data.image);
      router.push("/result");
    } else {
      alert("Failed to generate image.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🌌 Enter Your Fantasy</h1>

        {answers.map((answer, i) => (
          <input
            key={i}
            className="w-full border rounded p-2"
            placeholder={`Answer for Question ${i + 1}`}
            value={answer}
            onChange={(e) => {
              const newAnswers = [...answers];
              newAnswers[i] = e.target.value;
              setAnswers(newAnswers);
            }}
            required
          />
        ))}

        {!selfie ? (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded border w-full max-w-sm mx-auto"
            />
            <button
              type="button"
              onClick={capture}
              className="block mx-auto bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Capture Selfie
            </button>
          </>
        ) : (
          <img
            src={selfie}
            alt="Selfie"
            className="w-48 h-48 rounded object-cover mx-auto"
          />
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-3 rounded"
        >
          Generate My Dream
        </button>
      </form>
    </div>
  );
}
