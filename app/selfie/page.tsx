import dynamic from "next/dynamic";

const WebcamCapture = dynamic(() => import("../../components/WebcamCapture"), {
  ssr: false,
});

export default function SelfiePage() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <WebcamCapture />
    </main>
  );
}
