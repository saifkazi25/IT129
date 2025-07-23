import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function generateFantasyImage(prompt: string): Promise<string> {
  console.log('🧠 Calling SDXL with prompt:', prompt);

  const output = await replicate.run(
    'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
    {
      input: {
        prompt,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    }
  );

  if (!output || typeof output !== 'string') {
    throw new Error('Invalid SDXL output');
  }

  console.log('🖼️ SDXL output:', output);
  return output;
}

