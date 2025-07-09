import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    console.log('🟡 Received Body:', body);
    console.log('🟡 Answers Valid:', Array.isArray(answers), answers?.length);
    console.log('🟡 Image Length:', image?.length);

    if (!image || !answers || answers.length !== 7) {
      console.error('❌ Missing answers or image.');
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Step 1: Generate fantasy background using SDXL
    const fantasyPrompt = `Create a fantasy world with these elements: ${answers.join(', ')}.`;
    console.log('📨 Prompt to SDXL:', fantasyPrompt);

    const fantasyImageOutput = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          prompt: fantasyPrompt,
          width: 768,
          height: 768,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    const templateImage = fantasyImageOutput?.[0];
    if (!templateImage) {
      console.error('❌ Failed to get fantasy image from SDXL');
      return NextResponse.json({ error: 'Fantasy image generation failed.' }, { status: 500 });
    }

    // Step 2: Merge fantasy image with user selfie using facefusion
    const fusionOutput = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          template_image: templateImage,
          user_image: image,
        },
      }
    );

    const finalImage = fusionOutput?.[0];
    if (!finalImage) {
      console.error('❌ Facefusion model did not return an image');
      return NextResponse.json({ error: 'Image fusion failed.' }, { status: 500 });
    }

    console.log('✅ Final fantasy image:', finalImage);
    return NextResponse.json({ output: finalImage });
  } catch (err: any) {
    console.error('❌ Replicate error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
