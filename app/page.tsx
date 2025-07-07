'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  "If you could live in any time period, which would it be?",
  "What superpower do you secretly wish for?",
  "Pick your fantasy world: sci-fi, medieval, utopian, or dystopian?",
  "You wake up as the main character in your favorite movie. What is it?",
  "Would you rather be loved, feared, or worshipped?",
  "What color dominates your dream environment?",
  "Who’s beside you in your fantasy life (if anyone)?",
];

export default function Home() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));

  const handleChange = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    answers.forEach((answer, index) => {
      params.append(`q${index + 1}`, answer);
    });

    router.push(`/selfie?${params.toString()}`);
  };
