const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
  throw new Error("Missing REPLICATE_API_TOKEN in environment variables.");
}

const REPLICATE_BASE_URL = "https://api.replicate.com/v1/predictions";

export async function generateFantasyImage(prompt: string): Promise<string> {
  const response = await fetch(REPLICATE_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      version: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
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
        num_inference_steps: 25,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SDXL generation failed: ${errorText}`);
  }

  const result = await response.json();
  const imageUrl = result.output?.[0];

  if (!imageUrl) {
    throw new Error("No image URL returned from SDXL.");
  }

  return imageUrl;
}

export async function mergeFace(selfieUrl: string, targetImageUrl: string): Promise<string> {
  const response = await fetch(REPLICATE_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      version: "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      input: {
        source_image: selfieUrl,
        target_image: targetImageUrl,
        face_enhancer: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FaceFusion failed: ${errorText}`);
  }

  const result = await response.json();
  const mergedImageUrl = result.output;

  if (!mergedImageUrl) {
    throw new Error("No output image returned from FaceFusion.");
  }

  return mergedImageUrl;
}
