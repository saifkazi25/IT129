import QuizForm from '../components/QuizForm';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">🌌 Enter the Infinite Tsukuyomi</h1>
      <QuizForm />
    </main>
  );
}
