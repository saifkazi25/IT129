"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAnswers = localStorage.getItem("quizAnswers");
    const storedSelfieUrl = localStorage.getItem("selfieUrl");

    if (!storedAnswers || !storedSelfieUrl) {
      router.push("/selfie");
      return;
    }

    const quizAnswers: string[] = JSON.parse(storedAnswers);
    const selfieUrl: string = storedSelfieUrl;

    const fetchResult = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quizAnswers, selfieUrl }),
        });

        const data = await res.json();
        setImageUrl(data.finalImage);
      } catch (err) {
        console.error("Image generation failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Infinite Tsukuyomi</h1>

      {loading && <p>Generating your fantasy world... ✨</p>}

      {!loading && imageUrl && (
        <img
          src={imageUrl}
          alt="Your fantasy world"
          className="rounded-lg shadow-lg max-w-full mt-4"
        />
      )}

      {!loading && !imageUrl && (
        <p className="text-red-500 mt-4">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
