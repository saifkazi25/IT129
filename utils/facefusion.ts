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
    const output = (await replicate.run(
      'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      { input }
    )) as string;

    console.log('✅ FaceFusion result:', output);
    return output;
  } catch (error) {
    console.error('❌ FaceFusion failed:', error);
    return null;
  }
}
