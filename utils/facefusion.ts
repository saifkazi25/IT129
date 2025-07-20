import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

// Exported function for FaceFusion
export async function faceSwapWithFusion(baseImageUrl: string, faceImageUrl: string): Promise<string> {
  const version =
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7";

  const input = {
    base_image: baseImageUrl,
    face_image: faceImageUrl,
    face_swap: true,
    similarity_threshold: 0.5,
    use_current_crop: true,
  };

  console.log("🧬 FaceFusion input:", input);

  const output = await replicate.run(version, { input });

  console.log("🧑‍🚀 FaceFusion output:", output);

  if (!output || !Array.isArray(output) || output.length === 0) {
    throw new Error("No image returned from FaceFusion.");
  }

  return output[0] as string;
}
