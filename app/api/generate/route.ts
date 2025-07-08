import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '', // Set this in your Vercel env vars
});

export async function POST(req: Request) {
  try {
    const { answers, selfie } = await req.json();

    if (!answers || !selfie) {
      return NextResponse.json({ error: 'Missing answers or selfie.' }, { status: 400 });
    }

    // 👇 Combine answers into a prompt
    const prompt = `Create a beautiful cinematic scene that captures someone's deepest fantasy: ${answers.join(', ')}.`;

    // Step 1: Generate fantasy image using SDXL
    const output = await replicate.run(
      'stability-ai/sdxl:1d6adf4e33e2c89163ef79b3c2609ee5bb62c0d9244c0a1679b36c0e51b9f177',
      {
        input: {
          prompt,
          width: 768,
          height: 768,
          guidance_scale: 7,
        },
      }
    );

    if (!output || !Array.isArray(output) || output.length === 0) {
      return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
    }

    // Step 2: Face fusion with the selfie
    const faceFusion = await replicate.models.get('lucataco/modelscope-facefusion');
    const fusionOutput = await faceFusion.predict({
      input: {
        source_image: selfie,  // base64 selfie
        target_image: output[0],  // fantasy image
      },
    });

    // ✅ Fix: cast type so TypeScript allows `.image`
    const fusionImage = Array.isArray(fusionOutput)
      ? fusionOutput[0]
      : (fusionOutput as { image?: string })?.image || null;

    if (!fusionImage) {
      throw new Error('Face fusion failed.');
    }

    return NextResponse.json({ url: fusionImage });
  } catch (err: any) {
    console.error('Error in /api/generate:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
