import { Suspense } from "react";
import ResultDisplay from "@/components/ResultDisplay";

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading your fantasy...</div>}>
      <ResultDisplay />
    </Suspense>
  );
}
