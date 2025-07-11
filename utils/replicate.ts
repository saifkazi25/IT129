export async function generateFantasyImage(prompt: string | string[]) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
  });

  const fullPrompt = Array.isArray(prompt) ? prompt.join(', ') : prompt;

  const prediction = await replicate.run(
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    {
      input: {
        width: 768,
        height: 768,
        prompt: fullPrompt,
        refine: "expert_ensemble_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: false,
        high_noise_frac: 0.8,
        negative_prompt: "",
        prompt_strength: 0.8,
        num_inference_steps: 25,
      },
    }
  );

  const output = prediction?.output;
  return Array.isArray(output) ? output[0] : (output as string);
}
