export async function mergeFaceIntoImage({
  targetImageUrl,
  faceImageUrl,
}: {
  targetImageUrl: string;
  faceImageUrl: string;
}): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version:
        'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      input: {
        target_image: targetImageUrl,
        face_image: faceImageUrl,
        mode: 'replace',
      },
    }),
  });

  const prediction = await response.json();

  if (!prediction?.urls?.get) {
    throw new Error('FaceFusion prediction could not be started');
  }

  // Poll for completion
  let result;
  while (
    !result ||
    result.status === 'starting' ||
    result.status === 'processing'
  ) {
    const res = await fetch(prediction.urls.get, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    result = await res.json();
    if (result.status === 'succeeded') break;
    if (result.status === 'failed') throw new Error('FaceFusion failed');
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return result.output?.[0] || '';
}

