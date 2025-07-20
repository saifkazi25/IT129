"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      const quiz = localStorage.getItem("quizAnswers");
      const selfieUrl = localStorage.getItem("selfieUrl");

      if (!quiz || !selfieUrl) {
        setError("Missing input data. Please restart the quiz.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizAnswers: JSON.parse(quiz),
            selfieUrl: selfieUrl,
          }),
        });

        const data = await res.json();

        if (data.outputUrl) {
          setImageUrl(data.outputUrl);
        } else {
          setError("Image generation failed.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Generating your fantasy world...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center mt-10">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Fantasy!</h1>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Fantasy Generated"
          className="rounded-xl shadow-md max-w-full h-auto"
        />
      )}
    </div>
  );
}
