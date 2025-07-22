export async function generateFantasyImage({
  prompt,
}: {
  prompt: string;
}): Promise<string> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      input: {
        prompt,
        width: 768,
        height: 768,
        guidance_scale: 7.5,
        num_inference_steps: 30,
      },
    }),
  });

  const result = await response.json();

  if (!result?.urls?.get) {
    throw new Error("SDXL prediction failed to start.");
  }

  // Poll the status endpoint
  let prediction;
  while (
    !prediction ||
    prediction.status === "starting" ||
    prediction.status === "processing"
  ) {
    const res = await fetch(result.urls.get, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    prediction = await res.json();
    if (prediction.status === "succeeded") break;
    if (prediction.status === "failed") throw new Error("SDXL generation failed.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return prediction.output[0]; // Return the image URL
}
