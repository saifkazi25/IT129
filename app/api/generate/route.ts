import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// Reusable retry wrapper
async function runWithRetry<T>(
  fn: () => Promise<T>,
  retries = 10,
  delay = 7000
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      if (error?.status === 429 && attempt < retries - 1) {
        const retryAfter = error?.response?.headers?.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
        console.warn(`⚠️ Rate limited. Retrying in ${waitTime / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error('❌ Failed after retries');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image: userImage } = body;

    if (!userImage || !answers || answers.length !== 7) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const prompt = `Create a fantasy world with these elements: ${answers.join(', ')}.`;
    console.log('🧠 Prompt to SDXL:', prompt);

    // STEP 1: Generate fantasy image using SDXL
    const sdxlOutput = await runWithRetry<string[]>(() =>
      replicate.run(
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        {
          input: {
            prompt,
            width: 512,
            height: 512,
            refine: "expert_ensemble_refiner",
            scheduler: "K_EULER",
            num_outputs: 1,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }
      )
    );

    const templateImage = sdxlOutput?.[0];
    if (!templateImage) {
      throw new Error("Failed to generate fantasy image.");
    }

    console.log('🧪 SDXL image ready; pausing briefly before FaceFusion…');
    await new Promise((res) => setTimeout(res, 8000)); // 8-second pause

    // STEP 2: Merge with user selfie using FaceFusion
    const finalOutput = await runWithRetry<string[]>(() =>
      replicate.run(
        "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
        {
          input: {
            template_image: templateImage,
            user_image: userImage,
          },
        }
      ),
      10,   // retry up to 10 times
      7000  // wait 7 seconds between retries
    );

    return NextResponse.json({ output: finalOutput });
  } catch (err: any) {
    console.error('❌ Final error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}

