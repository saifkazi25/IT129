import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

async function runReplicate(prompt: string, image: string) {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const output = await replicate.run(
        "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
        {
          input: {
            template: "stabilityai/stable-diffusion-xl",
            target_image: image, // this is the selfie
            prompt,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }
      );
      return output;
    } catch (err: any) {
      const is429 = err?.response?.status === 429;
      const retryAfter = parseInt(err?.response?.headers?.get("retry-after") || "10", 10);
      if (is429) {
        console.warn(`⏳ Rate limit hit. Waiting ${retryAfter}s before retry...`);
        await new Promise((res) => setTimeout(res, retryAfter * 1000));
        attempt++;
        continue;
      }
      throw err; // not a rate limit issue
    }
  }

  throw new Error("⚠️ Too many retry attempts.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    console.log('📦 Received:', { answers, imageLength: image?.length });

    if (!image || !answers || answers.length !== 7) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const prompt = `Create a fantasy world with these elements: ${answers.join(', ')}. Merge with selfie.`;
    console.log('📨 Prompt to Replicate:', prompt);

    const output = await runReplicate(prompt, image);
    console.log('✅ Output generated successfully.');
    return NextResponse.json({ output });
  } catch (err: any) {
    console.error('❌ Final error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
