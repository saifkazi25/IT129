export async function mergeSelfieWithImage(
  selfieUrl: string,
  fantasyImageUrl: string
): Promise<string | null> {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      version: "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      input: {
        source_image: selfieUrl,
        target_image: fantasyImageUrl,
        face_enhancer: true,
        background_enhancer: true,
      },
    }),
  });

  if (!response.ok) {
    console.error("❌ Replicate FaceFusion API error:", await response.text());
    return null;
  }

  const data = await response.json();
  const output = data?.output;

  if (!output) {
    console.error("❌ No FaceFusion output returned:", data);
    return null;
  }

  return output;
}
