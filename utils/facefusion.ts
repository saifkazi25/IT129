export async function mergeFaceIntoImage({
  targetImageUrl,
  faceImageUrl,
}: {
  targetImageUrl: string;
  faceImageUrl: string;
}): Promise<string> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version:
        "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      input: {
        target_image: targetImageUrl,
        source_image: faceImageUrl,
        mode: "face_swap",
        similar_face: true,
      },
    }),
  });

  const result = await response.json();

  if (!result?.urls?.get) {
    throw new Error("FaceFusion failed to start prediction.");
  }

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
    if (prediction.status === "failed") throw new Error("FaceFusion failed.");
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return prediction.output;
}
