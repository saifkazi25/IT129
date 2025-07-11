import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// STEP 1: Generate fantasy image using SDXL
async function generateFantasyImage(prompt: string) {
  const prediction = await replicate.run(
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    {
      input: {
        width: 768,
        height: 768,
        prompt: prompt,
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

// STEP 2: Merge face into fantasy image using FaceFusion
async function mergeFace(fantasyImageUrl: string, selfieUrl: string) {
  const prediction = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    {
      input: {
        source_image: selfieUrl,
        target_image: fantasyImageUrl,
        face_enhancer: true,
      },
    }
  );

  const output = prediction?.output;
  return Array.isArray(output) ? output[0] : (output as string);
}

// ✅ Final correct export (only once!)
export { generateFantasyImage, mergeFace };
