import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function mergeFaces({
  targetImageUrl,
  sourceImageUrl,
}: {
  targetImageUrl: string;
  sourceImageUrl: string;
}): Promise<string> {
  const output = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    {
      input: {
        source_image: sourceImageUrl,
        target_image: targetImageUrl,
        sface_enhance: true,
        use_croper: true,
      },
    }
  );

  if (!output || typeof output !== "string") {
    throw new Error("FaceFusion failed to return an image URL.");
  }

  return output;
}

