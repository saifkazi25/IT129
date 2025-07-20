export async function generateFantasyImage(quizAnswers: string[]): Promise<string | null> {
  const prompt = `A fantasy scene based on these traits: ${quizAnswers.join(", ")}. Highly detailed, cinematic, front-facing hero, surreal lighting.`;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
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
        negative_prompt: "",
        prompt_strength: 0.8,
        num_inference_steps: 25,
      },
    }),
  });

  if (!response.ok) {
    console.error("❌ Replicate SDXL API error:", await response.text());
    return null;
  }

  const data = await response.json();
  const output = data?.output?.[0];

  if (!output) {
    console.error("❌ No SDXL output returned:", data);
    return null;
  }

  return output;
}
