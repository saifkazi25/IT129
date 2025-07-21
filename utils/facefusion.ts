import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function runFaceFusion({
  selfieUrl,
  fantasyImageUrl,
}: {
  selfieUrl: string;
  fantasyImageUrl: string;
}): Promise<string> {
  console.log('🧬 Running FaceFusion with:');
  console.log('👤 user_image:', selfieUrl);
  console.log('🌄 template_image:', fantasyImageUrl); // Correct field name!

  try {
    const prediction = await replicate.run(
      'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      {
        input: {
          user_image: selfieUrl,
          template_image: fantasyImageUrl, // ✅ CORRECT FIELD!
        },
      }
    );

    const mergedImageUrl = Array.isArray(prediction) ? prediction[0] : prediction;
    console.log('✨ FaceFusion result:', mergedImageUrl);

    return mergedImageUrl;
  } catch (error: any) {
    console.error('❌ FaceFusion API error:', error);
    throw new Error('FaceFusion failed');
  }
}
