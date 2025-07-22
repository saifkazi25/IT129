export async function generateFantasyImage({ prompt }: { prompt: string }): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version:
        'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      input: {
        prompt,
        width: 1024,
        height: 1024,
      },
    }),
  });

  const prediction = await response.json();

  if (!prediction?.urls?.get) {
    throw new Error('Fantasy image generation failed to start');
  }

  let result;
  while (!result || result.status === 'starting' || result.status === 'processing') {
    const res = await fetch(prediction.urls.get, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    result = await res.json();
    if (result.status === 'succeeded') break;
    if (result.status === 'failed') throw new Error('Fantasy image generation failed');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return result.output?.[0] || '';
}
