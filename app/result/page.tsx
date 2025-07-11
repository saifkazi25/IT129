"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [fantasyImage, setFantasyImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      const storedResult = localStorage.getItem("result");
      const storedFantasy = localStorage.getItem("fantasyImage");

      if (storedResult && storedFantasy) {
        setResult(storedResult);
        setFantasyImage(storedFantasy);
      }

      setLoading(false);
    };

    fetchResult();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (!result) return <div className="text-center p-4">No result found.</div>;

  return (
    <main className="min-h-screen bg-white text-black p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🌌 Your Infinite Tsukuyomi</h1>
      <p className="mb-2">Here is the fantasy world crafted from your imagination:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h2 className="font-semibold mb-2">Fantasy Background (Before FaceFusion)</h2>
          {fantasyImage && <img src={fantasyImage} alt="Fantasy Background" className="mx-auto rounded shadow" />}
        </div>

        <div>
          <h2 className="font-semibold mb-2">Final Result (With Your Face)</h2>
          {result && <img src={result} alt="Final Fantasy Result" className="mx-auto rounded shadow" />}
        </div>
      </div>
    </main>
  );
}

