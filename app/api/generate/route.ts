import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

async function runWithRetry<T>(
  fn: () => Promise<T>,
  retries = 10,
  delay = 7000
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const retryAfterHeader = error?.response?.headers?.get('retry-after');
      const waitTime = retryAfterHeader
        ? parseInt(retryAfterHeader) * 1000
        : delay;

      const isRateLimit = error?.status === 429;

      if (isRateLimit && attempt < retries - 1) {
        console.warn(`⚠️ Rate limited. Retrying in ${waitTime / 1000}s...`);
        await new Promise((res) => setTimeout(res, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error("❌ Failed after max retries.");
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

    const sdxlResult = await runWithRetry(() =>
      replicate.run("stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", {
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
      })
    );

    console.log("🔍 Raw SDXL result:", sdxlResult);

    const sdxlOutput = sdxlResult as string[];
    if (!sdxlOutput || !Array.isArray(sdxlOutput) || !sdxlOutput[0]) {
      throw new Error("❌ No SDXL output returned.");
    }

    const templateImage = sdxlOutput[0];
    console.log('🧪 SDXL image ready; pausing briefly before FaceFusion...');
    await new Promise((res) => setTimeout(res, 5000));

    const finalOutput = await runWithRetry(() =>
      replicate.run("lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7", {
        input: {
          template_image: templateImage,
          user_image: userImage,
        },
      })
    );

    return NextResponse.json({ output: finalOutput });
  } catch (err: any) {
    console.error("❌ Final error:", err);
    return NextResponse.json({ error: "Failed to generate image." }, { status: 500 });
  }
}

