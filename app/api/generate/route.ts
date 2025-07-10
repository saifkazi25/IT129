import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

async function runWithRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0 && err?.response?.status === 429) {
      const waitTime = err.response.headers['retry-after']
        ? parseInt(err.response.headers['retry-after']) * 1000
        : 3000;
      console.warn(`⚠️ Rate limited. Retrying in ${waitTime / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return runWithRetry(fn, retries - 1);
    }
    console.error('❌ Final error:', err);
    throw err;
  }
}

export async function POST(req: NextRequest) {
  const { answers, image } = await req.json();

  // Prompt building logic
  const prompt = `Create a fantasy world with these elements: ${answers.join(', ')}.`;

  console.log('🧠 Prompt to SDXL:', prompt);

  try {
    // Step 1: Generate fantasy image using SDXL
    const sdxlResult = await runWithRetry(() =>
      replicate.run("stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", {
        input: {
          prompt,
          width: 512,
          height: 512,
        },
      })
    );

    const imageUrls = (sdxlResult as any).output as string[];
    console.log('🔍 Raw SDXL result:', imageUrls);

    if (!imageUrls || !imageUrls[0]) {
      throw new Error('Failed to generate fantasy image.');
    }

    const fantasyImage = imageUrls[0];

    console.log('🧪 SDXL image ready; pausing briefly before FaceFusion...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 2: Merge with selfie using FaceFusion
    const faceFusionResult = await runWithRetry(() =>
      replicate.run("lucataco/modelscope-facefusion", {
        input: {
          source_image: image,
          target_image: fantasyImage,
        },
      })
    );

    const fusionUrls = (faceFusionResult as any).output as string[];
    console.log('🧬 FaceFusion result:', fusionUrls);

    if (!fusionUrls || !fusionUrls[0]) {
      throw new Error('Failed to generate final fantasy fusion.');
    }

    return NextResponse.json({ image: fusionUrls[0] });
  } catch (error) {
    console.error('❌ Error in generation flow:', error);
    return NextResponse.json({ error: 'Failed to generate fantasy image.' }, { status: 500 });
  }
}

