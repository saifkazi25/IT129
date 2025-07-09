import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// Helper: sleep for `ms` milliseconds
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    if (!answers || !image || answers.length !== 7) {
      return NextResponse.json({ error: 'Missing answers or image' }, { status: 400 });
    }

    const prompt = `Create a fantasy world with these elements: ${answers.join(', ')}.`;

    // === Retry wrapper ===
    const retryWithRateLimit = async (fn: () => Promise<any>, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await fn();
        } catch (err: any) {
          if (err?.status === 429 && err?.response?.headers?.get('retry-after')) {
            const wait = parseInt(err.response.headers.get('retry-after')) || 4;
            console.warn(`⏳ Rate limited. Retrying in ${wait}s...`);
            await sleep(wait * 1000);
            continue;
          }
          throw err;
        }
      }
      throw new Error('Exceeded retry limit due to API throttling');
    };

    const sdxlOutput = await retryWithRateLimit(() =>
      replicate.run("stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", {
        input: {
          prompt,
          width: 768,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      })
    );

    const templateImage = sdxlOutput?.[0];
    if (!templateImage) {
      return NextResponse.json({ error: 'Fantasy image generation failed.' }, { status: 500 });
    }

    const faceFusionOutput = await retryWithRateLimit(() =>
      replicate.run("lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7", {
        input: {
          template_image: templateImage,
          user_image: image,
        },
      })
    );

    const finalImage = faceFusionOutput?.[0];
    if (!finalImage) {
      return NextResponse.json({ error: 'Image fusion failed.' }, { status: 500 });
    }

    return NextResponse.json({ output: finalImage });
  } catch (err: any) {
    console.error('❌ Final error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
