import dynamic from "next/dynamic";

const QuizForm = dynamic(() => import("../components/QuizForm"), { ssr: false });

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <QuizForm />
    </main>
  );
}
