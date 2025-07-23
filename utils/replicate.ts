import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function generateFantasyImage(prompt: string): Promise<string> {
  console.log('⚙️ Calling SDXL with prompt:', prompt);

  const output = await replicate.run(
    'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
    {
      input: {
        prompt,
        width: 768,
        height: 768,
        refine: 'expert_ensemble_refiner',
        scheduler: 'K_EULER',
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    }
  );

  console.log('🖼️ SDXL raw output:', output);

  if (!output || !Array.isArray(output) || output.length === 0) {
    throw new Error('No image returned from SDXL');
  }

  return output[0];
}
