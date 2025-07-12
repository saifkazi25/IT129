'use client';

import { useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';

export default function SelfiePage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = React.useRef<Webcam>(null);
  const router = useRouter();

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setImage(screenshot);
  };

  const handleSubmit = async () => {
    if (!image) return alert('Please capture a selfie first.');

    const storedAnswers = localStorage.getItem('answers');
    if (!storedAnswers) return alert('No answers found.');

    const answers = JSON.parse(storedAnswers);

    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
          selfie: image,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('fantasyImage', data.fantasyImage);
        localStorage.setItem('mergedImage', data.mergedImage);
        router.push('/result');
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">📸 Take Your Selfie</h1>

      {image ? (
        <img src={image} alt="Selfie Preview" className="w-64 h-64 object-cover rounded-full" />
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-64 h-64 rounded-lg"
        />
      )}

      <div className="mt-4 flex gap-4">
        {!image && (
          <button
            onClick={capture}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Capture
          </button>
        )}

        {image && (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Creating Fantasy...' : 'Submit'}
          </button>
        )}
      </div>
    </main>
  );
}
