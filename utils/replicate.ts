export async function runSDXL(prompt: string): Promise<string> {
  const replicateUrl = 'https://api.replicate.com/v1/predictions';
  const replicateApiKey = process.env.REPLICATE_API_TOKEN;

  const response = await fetch(replicateUrl, {
    method: 'POST',
    headers: {
      Authorization: `Token ${replicateApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
      input: {
        prompt,
        width: 768,
        height: 768,
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('❌ SDXL error:', err);
    throw new Error('Failed to generate image with SDXL');
  }

  const json = await response.json();
  const predictionUrl = json.urls.get;

  // Wait for prediction to complete
  while (true) {
    const res = await fetch(predictionUrl, {
      headers: { Authorization: `Token ${replicateApiKey}` },
    });
    const data = await res.json();

    if (data.status === 'succeeded') {
      return data.output[data.output.length - 1]; // return final image
    } else if (data.status === 'failed') {
      throw new Error('SDXL prediction failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}

export async function runFaceFusion({
  template,
  user,
}: {
  template: string;
  user: string;
}): Promise<string> {
  const replicateApiKey = process.env.REPLICATE_API_TOKEN;

  const res = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${replicateApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: '52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      input: {
        template_image: template,
        user_image: user,
        mode: 'face_swap',
        with_alignment: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('❌ FaceFusion error:', err);
    throw new Error('FaceFusion API call failed');
  }

  const json = await res.json();
  const predictionUrl = json.urls.get;

  // Wait until prediction completes
  while (true) {
    const response = await fetch(predictionUrl, {
      headers: {
        Authorization: `Token ${replicateApiKey}`,
      },
    });
    const data = await response.json();

    if (data.status === 'succeeded') {
      return data.output;
    } else if (data.status === 'failed') {
      throw new Error('FaceFusion prediction failed');
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
}
