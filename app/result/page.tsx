'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const [fantasyImage, setFantasyImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFantasyImage = async () => {
      const image = searchParams.get('image');
      const answers = Array.from({ length: 7 }, (_, i) => searchParams.get(`q${i}`));
      console.log('📸 Selfie image found?', !!image);
      console.log('🧠 Answers:', answers);

      if (!image || answers.some(ans => ans === null)) {
        alert('Missing image or some answers.');
        return;
      }

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, image }),
        });

        const data = await res.json();
        console.log('🧞 Fantasy image URL:', data.output);

        if (data.output) {
          setFantasyImage(data.output);
        } else {
          alert('No image returned from backend.');
        }
      } catch (error) {
        console.error('❌ Error calling Replicate:', error);
        alert('Error calling fantasy generator.');
      } finally {
        setLoading(false);
      }
    };

    fetchFantasyImage();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">🪄 Your Fantasy Awaits</h1>
      {loading && <p>Generating your dream world...</p>}
      {!loading && fantasyImage && (
        <Image src={fantasyImage} alt="Your Fantasy" width={512} height={512} className="rounded-xl" />
      )}
    </div>
  );
}

