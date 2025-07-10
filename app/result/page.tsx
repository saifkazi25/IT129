"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
            image: storedImage,
          }),
        });

        const data = await response.json();

        if (response.ok && data.fantasyImage) {
          setFantasyImage(data.fantasyImage);
          if (data.result) {
            setMergedImage(data.result);
          }
        } else {
          setError("Image generation failed.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchFantasyImage();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white text-black">
      <h1 className="text-3xl font-bold mb-6">🌟 Your Fantasy Self</h1>

      {loading && <p>Generating your fantasy world...</p>}

      {error && (
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Go Back
          </button>
        </div>
      )}

      {!loading && fantasyImage && (
        <div className="flex flex-col items-center gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">🎨 Fantasy World</h2>
            <img
              src={fantasyImage}
              alt="Fantasy Background"
              className="w-full max-w-md rounded-lg shadow-md"
            />
          </div>

          {mergedImage && (
            <div>
              <h2 className="text-xl font-semibold mb-2">🧞 You in that World</h2>
              <img
                src={mergedImage}
                alt="Merged Fantasy Image"
                className="w-full max-w-md rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
