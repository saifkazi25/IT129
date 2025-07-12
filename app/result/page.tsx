'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const selfie = localStorage.getItem('selfie');
        const answers = [];

        for (let i = 0; i < 7; i++) {
          const answer = localStorage.getItem(`q${i}`);
          if (!answer) {
            alert('Missing quiz answers. Redirecting...');
            router.push('/');
            return;
          }
          answers.push(answer);
        }

        if (!selfie) {
          alert('Missing selfie. Redirecting...');
          router.push('/selfie');
          return;
        }

        const prompt = `A fantasy world where the person is a ${answers[2]} wearing ${answers[3]}, in a setting like ${answers[4]}, the vibe is ${answers[5]}, with powers of ${answers[6]}.`;

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, selfie }),
        });

        const data = await res.json();

        if (res.ok && data.finalImageUrl) {
          setFinalImage(data.finalImageUrl);
        } else {
          alert('Something went wrong while generating the image.');
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error generating image:', error);
        alert('Unexpected error. Check console.');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-3xl font-bold mb-4">🌌 Your Fantasy Awaits</h1>

      {loading ? (
        <p className="text-lg animate-pulse">Generating your dream world...</p>
      ) : finalImage ? (
        <img
          src={finalImage}
          alt="Your Fantasy"
          className="w-full max-w-md rounded-lg border shadow"
        />
      ) : (
        <p className="text-red-500">Failed to load fantasy image.</p>
      )}
    </main>
  );
}
