"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

// Define type for webcamRef to satisfy TypeScript
interface WebcamHandle {
  getScreenshot(): string | null;
}

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));
  const [selfie, setSelfie] = useState<string | null>(null);
  const webcamRef = useRef<WebcamHandle | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const captureSelfie = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfie(imageSrc);
    }
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

    if (!response.ok) {
      alert("Image generation failed.");
      return;
    }

    const data = await response.json();
    localStorage.setItem("generatedImage", data.image);
    router.push("/result");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black">
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-4">✨ Build Your Fantasy</h1>

        {answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            placeholder={`Answer for Question ${index + 1}`}
            className="w-full border rounded p-2"
            required
          />
        ))}

        {!selfie ? (
          <>
            <Webcam
              ref={webcamRef as any}
              screenshotFormat="image/jpeg"
              audio={false}
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
