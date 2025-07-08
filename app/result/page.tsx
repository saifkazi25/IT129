'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [fantasyImageUrl, setFantasyImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      const params = new URLSearchParams(searchParams.toString());
      const response = await fetch(`/api/generate?${params.toString()}`);
      const data = await response.json();
      setFantasyImageUrl(data.imageUrl);
      setLoading(false);
    };

    if (searchParams.toString()) {
      fetchImage();
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">✨ Your Fantasy Image</h1>
      {loading ? (
        <p>Generating your dream world… please wait.</p>
      ) : fantasyImageUrl ? (
        <Image src={fantasyImageUrl} alt="Your Fantasy" width={512} height={512} />
      ) : (
        <p>Failed to generate image. Try again.</p>
      )}
    </div>
  );
}
