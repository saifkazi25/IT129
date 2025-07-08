import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    if (!image || !answers || answers.length !== 7) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const prompt = `A fantasy version of the person, in a world with ${answers.join(', ')}`;
    console.log('🔮 Sending to Replicate:', { prompt });

    const output = await replicate.run(
      "lucataco/modelscope-facefusion:1abcb2b0b59cb552469fd0c5d2b57c2386a82e4b56f57b6609ba045cdfe2c07b", // ✅ added version hash
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
    console.error('❌ Replicate API error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
