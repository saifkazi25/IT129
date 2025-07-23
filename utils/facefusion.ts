import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function mergeFaces(targetImageUrl: string, sourceImageUrl: string): Promise<string | null> {
  console.log('📸 Merging selfie:', sourceImageUrl);
  console.log('🖼️ With fantasy image:', targetImageUrl);

  const input = {
    target_image: targetImageUrl,
    source_image: sourceImageUrl,
    mode: 'overwrite',
    detect_alignment: true,
    paste_back: true,
    watermark: false,
  };

  try {
    const output = await replicate.run(
      'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      { input }
    );

    console.log('✅ FaceFusion raw output:', output);

    // Some versions return object with URL, others return array
    const result =
      typeof output === 'string'
        ? output
        : Array.isArray(output)
        ? output[0]
        : (output as any)?.[0] ?? null;

    return result;
  } catch (error) {
    console.error('❌ FaceFusion failed:', error);
    return null;
  }
}
