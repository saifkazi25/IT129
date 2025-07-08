import { Suspense } from "react";
import ResultDisplay from "../components/ResultDisplay";

export default function ResultPage() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      {/* ⚡ Client component wrapped in Suspense fixes prerender error */}
      <ResultDisplay />
    </Suspense>
  );
}
