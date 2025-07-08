import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'edge';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { answers, selfie } = body;

  if (!answers || !selfie) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  // Step 1: Generate fantasy image from quiz answers
  const prompt = `A fantasy character portrait inspired by: ${answers.join(', ')}, fantasy art, ethereal lighting, ultra-detailed`;
  const output = await replicate.run(
    'stability-ai/sdxl:9e314e7b13f7edb4cbdd989bdf0ecf9e321f9395aa96cbdc3a8aa0d1a59d0b41',
    {
      input: {
        prompt,
        width: 512,
        height: 512,
      },
    }
  );

  const fantasyImage = Array.isArray(output) ? output[0] : output;
  if (!fantasyImage) {
    return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
  }

  // Step 2: Face fusion with the selfie
  const fusionOutput = await replicate.run(
    'lucataco/modelscope-facefusion:1cfc4cce7a179e5bd84e06595eaf3b7cf6e4663f4a0517e7e720f547da5af144',
    {
      input: {
        source_image: selfie,
        target_image: fantasyImage,
      },
    }
  );

  const fusionImage = Array.isArray(fusionOutput) ? fusionOutput[0] : fusionOutput?.image || null;

  if (!fusionImage) {
    return NextResponse.json({ error: 'Face fusion failed.' }, { status: 500 });
  }

  return NextResponse.json({ image: fusionImage });
}
