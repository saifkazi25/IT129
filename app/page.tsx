import QuizForm from '@/components/QuizForm';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8 text-center">🌌 Infinite Tsukuyomi Quiz</h1>
      <QuizForm />
    </main>
  );
}
