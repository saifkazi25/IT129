import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selfie, keywords } = body;

    if (!selfie || !keywords) {
      return NextResponse.json({ error: 'Missing selfie or keywords' }, { status: 400 });
    }

    // Step 1: Generate fantasy background using SDXL
    const sdxlOutput = await replicate.run(
      'stability-ai/sdxl:ab811e428c1f0e8761a8393c07bfa5d01d22a7bdbb3fb8a2c3d194c31018c184',
      {
        input: {
          prompt: keywords,
          width: 512,
          height: 512,
        },
      }
    );

    const fantasyImage =
      Array.isArray(sdxlOutput) && typeof sdxlOutput[0] === 'string'
        ? sdxlOutput[0]
        : null;

    if (!fantasyImage) {
      return NextResponse.json({ error: 'Fantasy generation failed.' }, { status: 500 });
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

    const fusionImage = Array.isArray(fusionOutput)
      ? fusionOutput[0]
      : typeof fusionOutput === 'string'
      ? fusionOutput
      : null;

    if (!fusionImage) {
      return NextResponse.json({ error: 'Face fusion failed.' }, { status: 500 });
    }

    return NextResponse.json({ image: fusionImage });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
