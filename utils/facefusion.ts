import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function mergeFaces(sourceImage: string, targetImage: string): Promise<string> {
  console.log('🔁 Calling FaceFusion with:', { sourceImage, targetImage });

  const output = await replicate.run(
    'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
    {
      input: {
        source_image: sourceImage,
        target_image: targetImage,
        version: 'v2.0',
        face_enhancer: true,
        watermark: false,
      },
    }
  );

  console.log('🔬 FaceFusion output:', output);

  if (!output || typeof output !== 'string') {
    throw new Error('FaceFusion did not return a valid image URL');
  }

  return output;
}
