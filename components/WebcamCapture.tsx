const handleSubmit = async () => {
  const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
  const selfieDataUrl = localStorage.getItem('selfie');

  if (!quizAnswers.length || !selfieDataUrl) {
    alert('Missing selfie or quiz answers!');
    return;
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quizAnswers, selfieDataUrl }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('finalImage', data.imageUrl);
    window.location.href = '/result';
  } else {
    console.error('❌ API Error:', data.error);
    alert('Image generation failed.');
  }
};
