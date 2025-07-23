import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function generateFantasyImage(quizAnswers: string[]): Promise<string | null> {
  const prompt = `A highly detailed fantasy scene featuring a person in a vivid, surreal setting inspired by: ${quizAnswers.join(
    ', '
  )}. The person should be standing clearly in the center, facing forward, fantasy-themed outfit, high resolution.`;

  console.log('🎨 SDXL prompt:', prompt);

  const input = {
    prompt,
    width: 1024,
    height: 1024,
    refine: 'expert_ensemble',
    scheduler: 'K_EULER',
    num_outputs: 1,
    guidance_scale: 7,
    apply_watermark: false,
    high_noise_frac: 0.8,
    negative_prompt:
      'blurry, distorted, low quality, cropped, face not visible, back turned, extra limbs, watermark, text',
  };

  try {
    const output = (await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      { input }
    )) as string[];

    console.log('✅ SDXL output:', output);
    return output?.[0] || null;
  } catch (error) {
    console.error('❌ SDXL generation failed:', error);
    return null;
  }
}
