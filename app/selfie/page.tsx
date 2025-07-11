"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomWebcam = dynamic(() => import("@/components/CustomWebcam"), { ssr: false });

export default function SelfiePage() {
  const router = useRouter();
  const [selfie, setSelfie] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCapture = (dataUrl: string) => {
    setSelfie(dataUrl);
  };

  const handleGenerate = async () => {
    if (!selfie) return;
    const quizAnswers = localStorage.getItem("quizAnswers");
    if (!quizAnswers) return alert("Missing quiz answers!");

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: JSON.parse(quizAnswers),
          image: selfie,
        }),
      });

      const data = await res.json();
      if (data.resultUrl) {
        localStorage.setItem("resultImage", data.resultUrl);
        router.push("/result");
      } else {
        alert("Image generation failed.");
        console.error(data);
      }
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">📸 Take Your Selfie</h1>
      {!selfie && <CustomWebcam onCapture={handleCapture} />}
      {selfie && (
        <div className="space-y-4">
          <img src={selfie} alt="Your selfie" className="rounded shadow-md w-64" />
          <button
            onClick={handleGenerate}
            disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            {isSubmitting ? "Generating Your Fantasy..." : "Enter the Infinite Tsukuyomi"}
          </button>
        </div>
      )}
    </main>
  );
}
