import dynamic from "next/dynamic";

const ResultDisplay = dynamic(() => import("../../components/ResultDisplay"), {
  ssr: false,
});

export default function ResultPage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <ResultDisplay />
    </main>
  );
}
