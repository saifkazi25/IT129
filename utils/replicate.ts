import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// SDXL Fantasy Image Generator
export async function generateFantasyImage(quizAnswers: string[]): Promise<string | null> {
  const fantasyElements = quizAnswers.join(", ");

  const prompt = `a fantasy portrait of a beautiful human character in a magical scene: ${fantasyElements}, front-facing, symmetrical face, highly detailed face, upper body visible, looking at the viewer, cinematic lighting, vivid fantasy background, high detail, digital art`;

  const output = await replicate.run(
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    {
      input: {
        prompt,
        width: 768,
        height: 768,
        refine: "expert_ensemble_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: false,
        high_noise_frac: 0.8,
        negative_prompt: "blurry, low quality, obscured face, face not visible, turned away, back of head, profile, extra limbs, distorted features, missing face",
        prompt_strength: 0.8,
        num_inference_steps: 30,
      },
    }
  );

  console.log("🧠 SDXL output:", output);

  if (Array.isArray(output) && output.length > 0) {
    return output[0] as string;
  }

  return null;
}
