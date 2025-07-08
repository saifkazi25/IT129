'use client';

import Image from 'next/image';

interface ResultDisplayProps {
  image: string;
}

export default function ResultDisplay({ image }: ResultDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={image}
        alt="Generated Fantasy"
        width={512}
        height={512}
        className="rounded-xl shadow-lg"
      />
      <p className="mt-4 text-lg font-semibold text-center">Here’s your fantasy world ✨</p>
    </div>
  );
}
