// utils/replicate.ts

const replicateApiBase = "https://api.replicate.com/v1/predictions";
const replicateVersion = "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc"; // your custom version

export async function generateFantasyImage(prompt: string): Promise<string> {
  const response = await fetch(replicateApiBase, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      version: replicateVersion,
      input: {
        width: 768,
        height: 768,
        prompt,
        refine: "expert_ensemble_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: false,
        high_noise_frac: 0.8,
        negative_prompt: "",
        prompt_strength: 0.8,
        num_inference_steps: 25
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate fantasy image: ${response.statusText}`);
  }

  const data = await response.json();

  const output = data?.output?.[0];
  if (!output) {
    throw new Error("No output image returned by Replicate.");
  }

  return output;
}
