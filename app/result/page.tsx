"use client";

import React, { useEffect, useState } from "react";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const storedSelfieUrl = localStorage.getItem("selfieUrl");
      const storedQuizAnswers = localStorage.getItem("quizAnswers");

      if (!storedSelfieUrl || !storedQuizAnswers) {
        setStatus("Missing selfie or quiz answers. Please start again.");
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
            selfieUrl: storedSelfieUrl,
            quizAnswers: JSON.parse(storedQuizAnswers),
          }),
        });

        const data = await res.json();

        if (data?.finalImageUrl) {
          setImageUrl(data.finalImageUrl);
          setStatus("Here is your fantasy image.");
        } else {
          setStatus("Failed to generate image.");
        }
      } catch (error) {
        console.error(error);
        setStatus("An error occurred while generating image.");
      } finally {
        setLoading(false);
      }
    };

    // ✅ delay to make sure localStorage is populated
    setTimeout(fetchData, 300); // <--- THIS DELAY HELPS

  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Infinite Tsukuyomi Result</h1>
      <p className="text-gray-600 mb-4">{status}</p>

      {loading && <p>Generating your fantasy...</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Fantasy result"
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      )}
    </div>
  );
}
