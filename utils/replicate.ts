import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// SDXL Fantasy Image
export async function generateFantasyImage(quizAnswers: string[]): Promise<string | null> {
  const prompt = `A fantasy portrait of a person in a magical scene based on: ${quizAnswers.join(
    ", "
  )}, front-facing, epic lighting, vivid background, cinematic fantasy art style`;

  const input = {
    prompt: prompt,
    width: 768,
    height: 768,
    refine: "expert_ensemble",
    scheduler: "K_EULER",
    lora_scale: 0.6,
    num_outputs: 1,
    guidance_scale: 7,
    high_noise_frac: 0.8,
    negative_prompt: "blurry, distorted, obscured face, extra limbs, back of head, low resolution",
    prompt_strength: 0.8,
    num_inference_steps: 30
  };

  const output = await replicate.run(
    "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
    { input }
  );

  console.log("🧠 SDXL output:", output);

  if (Array.isArray(output) && output.length > 0) {
    return output[0] as string;
  }

  return null;
}

// FaceFusion
export async function mergeFaceWithScene(selfieUrl: string, fantasyImageUrl: string): Promise<string | null> {
  const input = {
    source_image: selfieUrl,
    target_image: fantasyImageUrl,
    version: "v1.2",
    mode: "seamless"
  };

  const output = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    { input }
  );

  console.log("🌀 FaceFusion output:", output);

  if (Array.isArray(output) && output.length > 0) {
    return output[0] as string;
  }

  return null;
}
