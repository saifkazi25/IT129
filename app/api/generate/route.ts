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

    const prompt = `Create a fantasy world with these elements: ${answers.join(', ')}. Merge with selfie.`;
    console.log('📨 Prompt to Replicate:', prompt);

    const output = await replicate.run(
      "lucataco/modelscope-facefusion:14b80471165f13b3e73b3aecee30573583b9a3293d025d3b25623a54cbe7e3e6",
      {
        input: {
          template: "stabilityai/stable-diffusion-xl",
          target_image: image,
          prompt: prompt,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    console.log('✅ Replicate output:', output);
    return NextResponse.json({ output });
  } catch (err: any) {
    console.error('❌ Replicate error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
