import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { selfie, template, prompt } = body;

  if (!selfie || !template || !prompt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Step 1: Fuse Selfie with Template using FaceFusion
    const fusionOutput = await replicate.run(
      'lucataco/modelscope-facefusion:15e1f7b7b4c1dbe2be99d1c0c28ef915c614abfda2084167394e795b5d3e4a31',
      {
        input: {
          source_image: selfie,
          target_image: template,
        },
      }
    );

    const fusionImage = Array.isArray(fusionOutput)
      ? fusionOutput[0]
      : fusionOutput?.image || null;

    if (!fusionImage) {
      throw new Error('Face fusion failed.');
    }

    // Step 2: Feed fused image into SDXL with fantasy prompt
    const finalImageOutput = await replicate.run(
      'stability-ai/sdxl:db21e45e97e041d10fe32c9bfa4d90d61a26b37813ce327f3a7d5cd529b61790',
      {
        input: {
          prompt: prompt,
          image: fusionImage,
          image_mode: 'image_and_text',
          width: 1024,
          height: 1024,
          refine: 'expert_ensemble_refiner',
          scheduler: 'K_EULER',
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      }
    );

    const finalImage = Array.isArray(finalImageOutput)
      ? finalImageOutput[0]
      : finalImageOutput?.image || null;

    if (!finalImage) {
      throw new Error('Final fantasy generation failed.');
    }

    return NextResponse.json({ url: finalImage });
  } catch (error: any) {
    console.error('Error generating fantasy:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
