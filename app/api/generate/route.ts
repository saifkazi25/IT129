import { NextResponse } from 'next/server';
import Replicate from 'replicate';

/* ──────────────────────────────────────────────────────────
   Replicate client
   ────────────────────────────────────────────────────────── */
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/* ──────────────────────────────────────────────────────────
   Generic retry helper (handles 429s)
   ────────────────────────────────────────────────────────── */
async function runWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 3_000, // ms
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit = err?.status === 429;
      if (isRateLimit && attempt < retries - 1) {
        const hdr = err?.response?.headers?.get('retry-after');
        const wait = hdr ? +hdr * 1_000 : delay;
        console.warn(`⚠️  Rate-limited. Retry #${attempt + 1} in ${wait / 1_000}s`);
        await new Promise(res => setTimeout(res, wait));
      } else {
        throw err;
      }
    }
  }
  throw new Error('❌ Exhausted retries');
}

/* ──────────────────────────────────────────────────────────
   POST  /api/generate
   ────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const { answers, image: userImage } = await req.json();

    if (!Array.isArray(answers) || answers.length !== 7 || !userImage) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    /* ---------- 1️⃣  SDXL ---------- */
    const prompt = `Create a fantasy world with these elements: ${answers.join(', ')}.`;
    console.log('🧠 Prompt to SDXL:', prompt);

    const sdxlImages = await runWithRetry<string[]>(() =>
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
      ) as unknown as Promise<string[]>,   // 👈 cast
    );

    const templateImage = sdxlImages[0];
    if (!templateImage) throw new Error('SDXL produced no image');

    console.log('🧪 SDXL image ready; sending to FaceFusion…');

    /* ---------- 2️⃣  FaceFusion ---------- */
    const finalImages = await runWithRetry<string[]>(
      () =>
        replicate.run(
          'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
          {
            input: {
              template_image: templateImage,
              user_image: userImage,
            },
          },
        ) as unknown as Promise<string[]>,   // 👈 cast
      5,   // max retries
      8_000,
    );

    return NextResponse.json({ output: finalImages });
  } catch (err: any) {
    console.error('❌ Final error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
