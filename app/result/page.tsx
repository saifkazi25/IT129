import { Suspense } from 'react';
import ClientResult from '@/components/ClientResult';

export default function ResultPageWrapper() {
  return (
    <Suspense fallback={<p className="text-center mt-20">Loading...</p>}>
      <ClientResult />
    </Suspense>
  );
}

