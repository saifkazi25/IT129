import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function generateFantasyImage(prompt: string): Promise<string> {
  const input = {
    prompt,
    width: 1024,
    height: 1024,
    scheduler: 'DPMSolverMultistep',
    num_inference_steps: 30,
    guidance_scale: 7,
  };

  const prediction = await replicate.run(
    'stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
    { input }
  );

  if (!prediction || !Array.isArray(prediction) || !prediction[0]) {
    throw new Error('Fantasy image generation failed');
  }

  return prediction[0];
}

export async function mergeFaceWithFantasy(faceUrl: string, fantasyUrl: string): Promise<string> {
  const input = {
    source_image: faceUrl,
    target_image: fantasyUrl,
    mode: 'accurate',
  };

  const prediction = await replicate.run(
    'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
    { input }
  );

  if (!prediction || !Array.isArray(prediction) || !prediction[0]) {
    throw new Error('Face fusion failed');
  }

  return prediction[0];
}

