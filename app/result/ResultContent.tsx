"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultContent() {
  const searchParams = useSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      const qParams = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`));
      const selfie = searchParams.get("image");

      if (qParams.some((q) => !q) || !selfie) return;

      setLoading(true);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions: qParams,
            selfie,
          }),
        });

        const data = await res.json();
        setImage(data.image);
      } catch (err) {
        console.error("Error generating image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [searchParams]);

  return (
    <div className="p-6 min-h-screen bg-white text-black text-center">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy Image</h1>
      {loading && <p>Generating your dream world… please wait.</p>}
      {!loading && image && (
        <div className="p-4">
          <img
            src={image}
            alt="Generated Fantasy"
            className="mx-auto rounded shadow-lg max-w-full h-auto"
          />
          <p className="mt-4 text-lg font-semibold">Here is your fantasy world ✨</p>
        </div>
      )}
    </div>
  );
}

