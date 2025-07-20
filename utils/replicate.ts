import Replicate from "replicate";

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

interface SDXLInput {
  prompt: string;
  negative_prompt?: string;
}

// Main image generation function
export async function generateFantasyImage({
  prompt,
  negative_prompt = "",
}: SDXLInput): Promise<string> {
  const version =
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc";

  // Boost FaceFusion compatibility
  const fullPrompt = `${prompt}, highly detailed, symmetrical face, centered face, looking directly at camera, cinematic lighting, fantasy environment`;
  const fullNegativePrompt =
    negative_prompt ||
    "blurry, low-res, deformed, poorly drawn face, asymmetrical, occluded face, cropped, out of frame";

  const input = {
    width: 1024,
    height: 1024,
    prompt: fullPrompt,
    negative_prompt: fullNegativePrompt,
    refine: "expert_ensemble_refiner",
    scheduler: "K_EULER",
    lora_scale: 0.6,
    num_outputs: 1,
    guidance_scale: 7.5,
    apply_watermark: false,
    high_noise_frac: 0.8,
    prompt_strength: 0.8,
    num_inference_steps: 30,
  };

  console.log("🚀 Sending SDXL input:", input);

  const output = await replicate.run(version, { input });

  console.log("🧠 SDXL output:", output);

  if (!output || !Array.isArray(output) || output.length === 0) {
    throw new Error("No image returned from SDXL.");
  }

  return output[0] as string;
}
