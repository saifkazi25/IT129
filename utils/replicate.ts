import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function runSDXL(prompt: string): Promise<string> {
  const output = await replicate.run(
    'stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
    { input: { prompt } }
  );
  return (output as string[])[0];
}

export async function runFaceFusion(targetUrl: string, sourceUrl: string): Promise<string> {
  const output = await replicate.run(
    'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
    {
      input: {
        source_image: sourceUrl,
        target_image: targetUrl,
        batch_size: 1,
        use_enhancer: true,
      },
    }
  );
  return output as string;
}

