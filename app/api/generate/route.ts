import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { answers, image } = await req.json();

    if (!image || !answers || answers.length !== 7) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const prompt = `A fantasy version of the person, in a world with ${answers.join(', ')}`;

    const [url] = await replicate.run('lucataco/modelscope-facefusion', {
      input: {
        template: 'stabilityai/stable-diffusion-xl',
        target_image: image,
        prompt,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    });

    return NextResponse.json({ output: url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to generate image.' }, { status: 500 });
  }
}
