'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const generateFantasy = async () => {
      const quizAnswers = localStorage.getItem('quizAnswers');
      const selfie = localStorage.getItem('selfie');

      if (!quizAnswers || !selfie) {
        router.push('/');
        return;
      }

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: JSON.parse(quizAnswers),
            selfie,
          }),
        });

        if (!res.ok) {
          t
