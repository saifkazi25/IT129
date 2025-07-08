import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the webcam component (client-side only)
const WebcamCapture = dynamic(() => import("@/components/CustomWebcam"), {
  ssr: false,
});

export default function SelfiePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-6">📸 Take a Selfie</h1>
      <Suspense fallback={<p>Loading camera...</p>}>
        <WebcamCapture />
      </Suspense>
    </main>
  );
}
