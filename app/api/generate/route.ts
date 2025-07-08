import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    if (!image || !answers || !Array.isArray(answers) || answers.length !== 7) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const prompt = `A fantasy version of the person, in a world with ${answers.join(', ')}`;

    const output = await replicate.run(
      "lucataco/modelscope-facefusion:db21c1c7db5f8eb85846c55d9298760e72123708f3420f9ef1f07121feb248c34",
      {
        input: {
          template: "stabilityai/stable-diffusion-xl",
          target_image: image,
          prompt,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }
    );

    return NextResponse.json({ output });
  } catch (err) {
    console.error('❌ Replicate API error:', err);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
