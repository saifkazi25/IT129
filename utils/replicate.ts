import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

// Generate fantasy image using SDXL
export async function generateFantasyImage(prompt: string): Promise<string> {
  const output = await replicate.run(
    'stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
    {
      input: {
        prompt,
        width: 1024,
        height: 1024,
        refine: 'expert_ensemble_refiner',
        scheduler: 'K_EULER',
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    }
  );

  return Array.isArray(output) ? output[0] : (output as unknown as string);
}

// Merge face using lucataco/modelscope-facefusion
export async function mergeFace(
  backgroundUrl: string,
  selfieUrl: string
): Promise<string> {
  const output = await replicate.run(
    'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
    {
      input: {
        source_image: selfieUrl,
        target_image: backgroundUrl,
        mode: 'replace',
      },
    }
  );

  return Array.isArray(output) ? output[0] : (output as unknown as string);
}

