import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function mergeFaces(selfieUrl: string, fantasyImageUrl: string): Promise<string> {
  console.log("📸 Merging selfie:", selfieUrl);
  console.log("🖼️ With fantasy image:", fantasyImageUrl);

  const output = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    {
      input: {
        source_image: selfieUrl,
        target_image: fantasyImageUrl,
        face_enhancer: true,
        gfpgan_upscale: false
      }
    }
  );

  console.log("🧠 FaceFusion output:", output);

  // Return final merged image URL
  if (typeof output === "string") {
    return output;
  } else if (Array.isArray(output)) {
    return output[0]; // Some models return [url]
  } else {
    throw new Error("FaceFusion failed to return a valid image URL.");
  }
}
