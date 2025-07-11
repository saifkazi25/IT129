import QuizForm from "@/components/QuizForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-black p-4">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">🌀 Enter the Infinite Tsukuyomi</h1>
        <p className="text-center text-gray-700">Answer the 7 questions to reveal your fantasy world...</p>
        <QuizForm />
      </div>
    </main>
  );
}


