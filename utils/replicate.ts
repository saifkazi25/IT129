const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN as string;

export async function generateFantasyImage(prompt: string): Promise<string> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      input: {
        prompt,
        width: 1024,
        height: 1024,
      },
    }),
  });

  const prediction = await response.json();

  if (prediction?.error) {
    throw new Error(prediction.error);
  }

  // Wait until image generation is complete
  let imageUrl = "";
  while (!imageUrl) {
    const statusCheck = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
    });

    const statusResult = await statusCheck.json();

    if (statusResult.status === "succeeded") {
      imageUrl = statusResult.output?.[0] || "";
    } else if (statusResult.status === "failed") {
      throw new Error("Image generation failed");
    }

    await new Promise((res) => setTimeout(res, 2000));
  }

  return imageUrl;
}

export async function mergeFace(fantasyUrl: string, selfieUrl: string): Promise<string> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      input: {
        source_image: selfieUrl,
        target_image: fantasyUrl,
      },
    }),
  });

  const prediction = await response.json();

  if (prediction?.error) {
    throw new Error(prediction.error);
  }

  // Wait until merging is complete
  let mergedUrl = "";
  while (!mergedUrl) {
    const statusCheck = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
    });

    const statusResult = await statusCheck.json();

    if (statusResult.status === "succeeded") {
      mergedUrl = statusResult.output;
    } else if (statusResult.status === "failed") {
      throw new Error("Face merging failed");
    }

    await new Promise((res) => setTimeout(res, 2000));
  }

  return mergedUrl;
}
