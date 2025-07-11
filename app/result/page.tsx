"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const storedAnswers = localStorage.getItem("quizAnswers");
      const storedSelfie = localStorage.getItem("selfie");

      if (!storedAnswers || !storedSelfie) {
        alert("Missing quiz answers or selfie!");
        return;
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: JSON.parse(storedAnswers),
            selfie: storedSelfie,
          }),
        });

        const data = await res.json();
        setImage(data.output?.merged || data.output?.fantasy);
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Fantasy World</h1>
      {loading ? (
        <p>Generating your fantasy image...</p>
      ) : image ? (
        <img src={image} alt="Fantasy Result" className="max-w-full rounded-lg shadow-lg" />
      ) : (
        <p>Something went wrong. Please try again.</p>
      )}
    </main>
  );
}



