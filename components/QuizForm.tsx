"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState(Array(7).fill(""));
  const [selfie, setSelfie] = useState<string | null>(null);

  // ⬇️ capture selfie from webcam
  const webcamRef = React.useRef<Webcam>(null);
  const capture = () => {
    const img = webcamRef.current?.getScreenshot();
    if (img) setSelfie(img);
  };

  // ⬇️ submit quiz
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfie) return alert("Please take a selfie first!");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, image: selfie }),
    });

    if (!res.ok) {
      alert("Something went wrong. Try again.");
      return;
    }

    const { image } = await res.json();
    // store for the result page
    localStorage.setItem("generatedImage", image);
    router.push("/result");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-xl mx-auto p-6"
    >
      {answers.map((val, i) => (
        <input
          key={i}
          className="border p-2 rounded"
          placeholder={`Question ${i + 1}`}
          value={val}
          onChange={(e) =>
            setAnswers((prev) => {
              const next = [...prev];
              next[i] = e.target.value;
              return next;
            })
          }
          required
        />
      ))}

      {/* Webcam + capture button ----------------------------------------- */}
      {!selfie ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded border"
          />
          <button
            type="button"
            onClick={capture}
            className="bg-blue-600 text-white p-2 rounded"
          >
            Capture Selfie
          </button>
        </>
      ) : (
        <img
          src={selfie}
          alt="Your Selfie"
          className="w-48 h-48 object-cover rounded self-center"
        />
      )}

      <button
        type="submit"
        className="bg-green-600 text-white p-3 rounded font-bold"
      >
        See My Fantasy!
      </button>
    </form>
  );
}
