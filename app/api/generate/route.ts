import { NextResponse } from 'next/server';
import Replicate, { ApiError } from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// simple helper — wait x ms
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (
        err instanceof ApiError &&
        err.status === 429 &&
        attempt < maxRetries
      ) {
        // respect Retry-After header if provided, else back-off 2ⁿ s
        const retryAfter =
          typeof err.response?.headers?.get === 'function'
            ? Number(err.response.headers.get('retry-after')) || 2 ** attempt
            : 2 ** attempt;
        console.warn(`🔄 429 hit. Waiting ${retryAfter}s, retry #${attempt + 1}`);
        await sleep(retryAfter * 1000);
        attempt += 1;
        continue;
      }
      throw err; // different error or ran out of retries
    }
  }
}

export async function POST(req: Request) {
  try {
    const { answers, image: userImage } = await req.json();

    if (!userImage || !Array.isArray(answers) || answers.length !== 7) {
      return NextResponse.json(
        { error: 'Missing required fields.' },
        { status: 400 },
      );
    }

    const prompt = `Create a fantasy world with these elements: ${answers.join(
      ', ',
    )}.`;
    console.log('🧠 Prompt to SDXL:', prompt);

    /* ---------- 1️⃣  SDXL ---------- */
    const sdxlOutput: string[] = await callWithRetry(() =>
      replicate.run(
        'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
        {
          input: {
            prompt,
            width: 512,
            height: 512,
            refine: 'expert_ensemble_refiner',
            scheduler: 'K_EULER',
            num_outputs: 1,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        },
      ),
    );

    const templateImage = sdxlOutput?.[0];
    if (!templateImage) throw new Error('SDXL returned no image');

    console.log('🧪 SDXL done – feeding to FaceFusion');

    /* ---------- 2️⃣  Face-Fusion ---------- */
    const finalOutput: string[] = await callWithRetry(() =>
      replicate.run(
        'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
        {
          input: {
            template_image: templateImage,
            user_image: userImage,
          },
        },
      ),
    );

    return NextResponse.json({ output: finalOutput?.[0] ?? null });
  } catch (err) {
    console.error('❌ Final error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
