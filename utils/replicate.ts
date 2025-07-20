import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// SDXL Fantasy Image Generation
export async function generateFantasyImage(quizAnswers: string[]): Promise<string | null> {
  const prompt = `A fantasy portrait of a person in a magical scene based on: ${quizAnswers.join(
    ", "
  )}, front-facing, epic lighting, vivid background, cinematic fantasy art style`;

  const input = {
    prompt,
    width: 768,
    height: 768,
    refine: "expert_ensemble_refiner", // updated refine method
    scheduler: "K_EULER",
    lora_scale: 0.6,
    num_outputs: 1,
    guidance_scale: 7.5, // slightly increased for better quality
    apply_watermark: false, // disables watermark
    high_noise_frac: 0.8,
    negative_prompt: "blurry, distorted, obscured face, extra limbs, back of head, low resolution",
    prompt_strength: 0.8,
    num_inference_steps: 25, // reduced slightly for performance
  };

  const output = await replicate.run(
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    { input }
  );

  console.log("🧠 SDXL output:", output);

  if (Array.isArray(output) && output.length > 0) {
    return output[0] as string;
  }

  return null;
}

// FaceFusion Merge
export async function mergeFaceWithScene(selfieUrl: string, fantasyImageUrl: string): Promise<string | null> {
  const input = {
    source_image: selfieUrl,
    target_image: fantasyImageUrl,
    version: "v1.2",
    mode: "seamless",
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
