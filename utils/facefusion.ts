export async function runFaceFusion(userImageUrl: string, backgroundImageUrl: string): Promise<string> {
  console.log("🧬 Running FaceFusion with:");
  console.log("👤 user_image:", userImageUrl);
  console.log("🌄 background_image:", backgroundImageUrl);

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      input: {
        user_image: userImageUrl,
        target_image: backgroundImageUrl,
        mode: "face_swap",
        output_quality: "high"
      }
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    console.error("❌ FaceFusion API error:", json);
    throw new Error(json?.error?.description || 'FaceFusion failed');
  }

  const getOutput = async () => {
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${json.id}`, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    const pollJson = await pollRes.json();
    if (pollJson.status === 'succeeded') {
      return pollJson.output;
    } else if (pollJson.status === 'failed') {
      throw new Error('FaceFusion prediction failed');
    } else {
      await new Promise((r) => setTimeout(r, 2000));
      return getOutput();
    }
  };

  const result = await getOutput();

  if (Array.isArray(result)) {
    return result[result.length - 1]; // Final image
  } else if (typeof result === 'string') {
    return result;
  } else {
    throw new Error('Unexpected output format from FaceFusion');
  }
}
