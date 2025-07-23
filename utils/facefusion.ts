import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function mergeFaces(sourceImageUrl: string, targetImageUrl: string): Promise<string> {
  console.log('🔗 Calling FaceFusion with:');
  console.log('👤 Source (selfie):', sourceImageUrl);
  console.log('🌌 Target (fantasy):', targetImageUrl);

  const output = await replicate.run(
    'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
    {
      input: {
        source_image: sourceImageUrl,
        target_image: targetImageUrl,
      },
    }
  );

  if (!output || typeof output !== 'string') {
    throw new Error('Invalid FaceFusion output');
  }

  console.log('🧬 FaceFusion output URL:', output);
  return output;
}
