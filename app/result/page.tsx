"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data?.finalImageUrl) {
          setImageUrl(data.finalImageUrl);
        } else {
          console.error("No image URL found in response:", data);
        }
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white" />
        </div>
      )}

      {!loading && imageUrl && (
        <>
          <img
            src={imageUrl}
            alt="Your Fantasy Image"
            className="w-full h-full object-cover"
            onLoad={() => setLoading(false)}
          />

          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
            <button
              onClick={() => router.push("/")}
              className="bg-white text-black px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition"
            >
              Go Back
            </button>

            <a
              href={imageUrl}
              download="my_fantasy_image.png"
              className="bg-white text-black px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition"
            >
              Download Image
            </a>
          </div>
        </>
      )}
    </div>
  );
}
