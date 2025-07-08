'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientResult() {
  const searchParams = useSearchParams();
  const [fantasyImageUrl, setFantasyImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (!searchParams) return;

      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/generate?${params.toString()}`);
      const data = await response.json();
      setFantasyImageUrl(data.imageUrl);
    };

    fetchImage();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl mb-4">✨ Your Fantasy Awaits</h1>
      {fantasyImageUrl ? (
        <img src={fantasyImageUrl} alt="Generated fantasy" className="max-w-full rounded shadow" />
      ) : (
        <p>🧠 Generating your fantasy image...</p>
      )}
    </div>
  );
}
