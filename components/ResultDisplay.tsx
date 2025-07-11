'use client';

import { useEffect, useState } from 'react';

interface ResultDisplayProps {
  answers: string[];
  selfieImage: string;
}

export default function ResultDisplay({ answers, selfieImage }: ResultDisplayProps) {
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);

  const handleMerge = async () => {
    setIsMerging(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, selfieImage }),
      });

      const data = await response.json();
      setMergedImage(data.outputImageUrl);
    } catch (error) {
      console.error('Error merging image:', error);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg">Your Fantasy World Based on Your Answers:</p>
      <ul className="text-sm text-left list-disc">
        {answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
      <img src={selfieImage} alt="Your Selfie" className="w-48 h-48 rounded-full mt-4 border" />
      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleMerge}
        disabled={isMerging}
      >
        {isMerging ? 'Merging...' : 'Merge My Face'}
      </button>
      {mergedImage && (
        <img
          src={mergedImage}
          alt="Merged Fantasy Image"
          className="mt-6 w-full max-w-md border rounded"
        />
      )}
    </div>
  );
}
