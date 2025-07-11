import React, { Suspense } from "react";
import QuizForm from "@/components/QuizForm";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-4xl font-bold mb-4">🧠 Infinite Tsukuyomi Quiz</h1>
      <Suspense fallback={<p>Loading quiz...</p>}>
        <QuizForm />
      </Suspense>
    </main>
  );
}

