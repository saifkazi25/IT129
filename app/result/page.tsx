"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      const storedAnswers = localStorage.getItem("quizAnswers");
      const selfieUrl = localStorage.getItem("selfieUrl");

      if (!storedAnswers || !selfieUrl) {
        console.warn("Missing data, redirecting...");
        router.push("/selfie");
        return;
      }

      const quizAnswers: string[] = JSON.parse(storedAnswers);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await response.json();

        if (data.outputImageUrl) {
          setImageUrl(data.outputImageUrl);
        } else {
          console.error("No image returned:", data);
        }
      } catch (err) {
        console.error("Error fetching image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Fantasy Revealed</h1>

      {loading ? (
        <p className="text-lg">Generating your fantasy... please wait ✨</p>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt="Fantasy Result"
          className="max-w-full max-h-[80vh] rounded-lg shadow-lg mt-4"
        />
      ) : (
        <p className="text-red-500 text-lg mt-4">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
