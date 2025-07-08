import CustomWebcam from '@/components/CustomWebcam';

export default function SelfiePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Take a Selfie</h1>
      <CustomWebcam />
    </main>
  );
}

