'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(""));

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    localStorage.setItem("fantasy-answers", JSON.stringify(answers));
    router.push("/selfie");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {answers.map((_, i) => (
        <div key={i}>
          <label className="block font-semibold text-lg">Q{i + 1}</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder={`Enter fantasy detail #${i + 1}`}
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
      >
        Next: Take a Selfie
      </button>
    </div>
  );
}
