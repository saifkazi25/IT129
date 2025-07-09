import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

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
    const sdxlOutput = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          prompt: prompt,
          width: 512,
          height: 512,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    const templateImage = sdxlOutput?.[0];
    if (!templateImage) {
      throw new Error("Failed to generate fantasy image.");
    }

    console.log('🧪 SDXL image generated, sending to FaceFusion...');

    // STEP 2: Merge with user selfie using FaceFusion
    const finalOutput = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          template_image: templateImage,
          user_image: userImage,
        },
      }
    );

    return NextResponse.json({ output: finalOutput });
  } catch (err: any) {
    console.error('❌ Final error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
