"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAnswers = localStorage.getItem("quizAnswers");
    const storedImage = localStorage.getItem("selfieImage");

    if (!storedAnswers || !storedImage) {
      setError("Missing data. Please retake the quiz.");
      setLoading(false);
      return;
    }

    const answers = JSON.parse(storedAnswers);

    const fetchFantasyImage = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, image: storedImage }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Image generation failed");
        }

        setFantasyImage(data.fantasyImage);
        setResultImage(data.result);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFantasyImage();
  }, []);

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "tsukuyomi.png";
    link.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white text-black text-center">
      <h1 className="text-3xl font-bold mb-6">🌌 Your Infinite Tsukuyomi</h1>

      {loading && <p>Creating your fantasy world...</p>}

      {error && (
        <div className="text-red-600">
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go Back
          </button>
        </div>
      )}

      {!loading && fantasyImage && (
        <>
          <p className="mb-4 text-sm text-gray-600">
            🧠 Generated fantasy world... now merging your face...
          </p>
          <img
            src={resultImage || fantasyImage}
            alt="Your fantasy self"
            className="w-full max-w-md rounded-lg shadow-lg mb-4"
          />
          {!resultImage ? (
            <p className="text-sm text-gray-500">🧬 FaceFusion in progress...</p>
          ) : (
            <>
              <p className="text-green-700 font-semibold mb-2">✨ Face merge complete!</p>
              <button
                onClick={downloadImage}
                className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
              >
                Download Image
              </button>
            </>
          )}
        </>
      )}
    </main>
  );
}
