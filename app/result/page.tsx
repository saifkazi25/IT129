"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [fantasyImageUrl, setFantasyImageUrl] = useState<string | null>(null);
  const [mergedImageUrl, setMergedImageUrl] = useState<string | null>(null);
  const [loadingFantasy, setLoadingFantasy] = useState(true);
  const [loadingMerge, setLoadingMerge] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateFantasyImage = async () => {
      try {
        const quizAnswers = JSON.parse(localStorage.getItem("quizAnswers") || "[]");

        if (!quizAnswers || quizAnswers.length !== 7) {
          setError("Missing or invalid quiz answers");
          setLoadingFantasy(false);
          return;
        }

        const res = await fetch("/api/generate", {
          method: "POST",
          body: JSON.stringify({ quizAnswers }),
        });

        const data = await res.json();

        if (res.ok && data.fantasyImageUrl) {
          setFantasyImageUrl(data.fantasyImageUrl);
        } else {
          setError("Fantasy image generation failed");
        }
      } catch (err) {
        console.error("🔥 Unexpected error:", err);
        setError("Something went wrong");
      } finally {
        setLoadingFantasy(false);
      }
    };

    generateFantasyImage();
  }, []);

  const handleMergeClick = async () => {
    const selfieUrl = localStorage.getItem("selfieUrl");

    if (!selfieUrl || !fantasyImageUrl) {
      setError("Missing selfie or fantasy image");
      return;
    }

    setLoadingMerge(true);

    try {
      const res = await fetch("/api/merge", {
        method: "POST",
        body: JSON.stringify({ selfieUrl, fantasyImageUrl }),
      });

      const data = await res.json();

      if (res.ok && data.mergedImageUrl) {
        setMergedImageUrl(data.mergedImageUrl);
      } else {
        setError("Face merge failed");
      }
    } catch (err) {
      console.error("🔥 Merge error:", err);
      setError("Merge failed");
    } finally {
      setLoadingMerge(false);
    }
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Fantasy Image</h1>

      {loadingFantasy && <p>Generating fantasy world... 🌌</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loadingFantasy && fantasyImageUrl && !mergedImageUrl && (
        <>
          <img
            src={fantasyImageUrl}
            alt="Fantasy Image"
            className="w-full max-w-xl mx-auto rounded-xl shadow-xl mb-4"
          />
          <button
            onClick={handleMergeClick}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
            disabled={loadingMerge}
          >
            {loadingMerge ? "Merging..." : "Merge My Face 🧠"}
          </button>
        </>
      )}

      {mergedImageUrl && (
        <img
          src={mergedImageUrl}
          alt="Final Fantasy Image"
          className="w-full max-w-xl mx-auto rounded-xl shadow-xl mt-6"
        />
      )}
    </div>
  );
}
