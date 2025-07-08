"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

// ────────────────────────────────────────────────────────────
// The webcam instance type (includes getScreenshot, etc.)
type WebcamRef = React.ElementRef<typeof Webcam>;
// ────────────────────────────────────────────────────────────

export default function QuizForm() {
  const router = useRouter();

  // 7 answers, initially blank
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));

  // base64 selfie once captured
  const [selfie, setSelfie] = useState<string | null>(null);

  // webcam reference
  const webcamRef = useRef<WebcamRef | null>(null);

  // update a single answer
  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  // take a snapshot
  const captureSelfie = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setSelfie(img);
  };

  // submit to backend
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
      alert("Image generation failed – try again.");
      return;
    }

    const { image } = await res.json();
    localStorage.setItem("generatedImage", image);
    router.push("/result");
  };

  // ─────────── UI ───────────
  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          ✨ Build Your Fantasy
        </h1>

        {/* seven questions */}
        {answers.map((ans, i) => (
          <input
            key={i}
            value={ans}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            placeholder={`Answer for Question ${i + 1}`}
            className="w-full border rounded p-2"
            required
          />
        ))}

        {/* webcam / selfie */}
        {!selfie ? (
          <>
            <Webcam
              ref={webcamRef}
              audio={false}
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
            alt="Captured Selfie"
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
