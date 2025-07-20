import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// New SDXL version you provided
const SDXL_VERSION =
  "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc";

// Existing FaceFusion version
const FACEFUSION_VERSION =
  "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7";

export async function generateFantasyImage(quizAnswers: string[]): Promise<string | null> {
  const prompt = `A front-facing cinematic fantasy portrait of a person in a ${quizAnswers[0]} setting, located in ${quizAnswers[1]}, dressed as a ${quizAnswers[2]}, wearing a ${quizAnswers[3]}, in a ${quizAnswers[4]} environment, mood is ${quizAnswers[5]}, element of ${quizAnswers[6]}. high detail, dreamlike, 4K, intricate, ultra-realistic`;

  const input = {
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
  };

  try {
    const output = await replicate.run(SDXL_VERSION, { input });
    console.log("🧠 SDXL output:", output);

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    } else {
      console.error("❌ SDXL returned no output. Full response:", output);
      return null;
    }
  } catch (err) {
    console.error("❌ SDXL generation error:", err);
    return null;
  }
}

export async function mergeFaceWithScene(selfieUrl: string, fantasyImageUrl: string): Promise<string | null> {
  const input = {
    source_image: selfieUrl,
    target_image: fantasyImageUrl,
    version: "v1.2",
    mode: "seamless",
  };

  try {
    const output = await replicate.run(FACEFUSION_VERSION, { input });
    console.log("🌀 FaceFusion output:", output);

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    } else {
      console.error("❌ FaceFusion returned no output. Full response:", output);
      return null;
    }
  } catch (err) {
    console.error("❌ FaceFusion failed:", err);
    return null;
  }
}
