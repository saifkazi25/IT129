const replicateBaseUrl = 'https://api.replicate.com/v1/predictions';

export async function runSDXL(prompt: string): Promise<string> {
  const response = await fetch(replicateBaseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
      input: {
        prompt,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        num_inference_steps: 30,
      },
    }),
  });

  const prediction = await response.json();

  if (prediction.error) {
    throw new Error(prediction.error);
  }

  // Wait for status to be 'succeeded'
  const statusUrl = prediction.urls.get;
  let imageUrl = '';

  while (!imageUrl) {
    const poll = await fetch(statusUrl, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    const result = await poll.json();

    if (result.status === 'succeeded') {
      imageUrl = result.output?.[0];
    } else if (result.status === 'failed') {
      throw new Error('Image generation failed');
    } else {
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  return imageUrl;
}

export async function runFaceFusion(userImageUrl: string, generatedImageUrl: string): Promise<string> {
  const response = await fetch(replicateBaseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: '52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      input: {
        target_image: generatedImageUrl,
        source_image: userImageUrl,
        face_swap_degree: 1,
        use_gfpgan: true,
        gfpgan_visibility: 1,
      },
    }),
  });

  const prediction = await response.json();

  if (prediction.error) {
    throw new Error(prediction.error);
  }

  const statusUrl = prediction.urls.get;
  let mergedImageUrl = '';

  while (!mergedImageUrl) {
    const poll = await fetch(statusUrl, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    const result = await poll.json();

    if (result.status === 'succeeded') {
      mergedImageUrl = result.output;
    } else if (result.status === 'failed') {
      throw new Error('Face fusion failed');
    } else {
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  return mergedImageUrl;
}
