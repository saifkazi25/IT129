import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function mergeFaces(selfieUrl: string, fantasyUrl: string): Promise<string> {
  const output = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    {
      input: {
        target_image: fantasyUrl,
        source_image: selfieUrl,
        mode: "face_swap",
        face_enhancer: true,
      },
    }
  );

  if (!output || typeof output !== "string") {
    throw new Error("FaceFusion failed to return a valid URL.");
  }

  return output;
}
