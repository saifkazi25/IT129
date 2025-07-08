"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

// 👉 Explicit interface describing just what we need from the ref
interface WebcamHandle {
  getScreenshot(): string | null;
}

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));
  const [selfie, setSelfie] = useState<string | null>(null);

  // ✅ ref now has the correct type, so TS recognises getScreenshot()
  const webcamRef = useRef<WebcamHandle | null>(null);

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
    if (!selfie) return alert("Please capture a selfie first!");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, image: selfie }),
    });

    if (!res.ok) return alert("Image generation failed.");

    const { image } = await res.json();
    localStorage.setItem("generatedImage", image);
    router.push("/result");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">✨ Build Your Fantasy</h1>

        {answers.map((ans, i) => (
          <input
            key={i}
            className="w-full border rounded p-2"
            placeholder={`Answer for Question ${i + 1}`}
            value={ans}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            required
          />
        ))}

        {!selfie ? (
          <>
            <Webcam
              ref={webcamRef as any}          {/* casting ok because we typed handle above */}
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
            alt="Selfie"
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


