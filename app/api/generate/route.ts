// /app/api/generate/route.ts
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, image } = body;

    if (!prompt || !image) {
      return NextResponse.json({ error: 'Missing prompt or image' }, { status: 400 });
    }

    const output = await replicate.run(
      'lucataco/modelscope-facefusion:5fd66f1b93d6ed8b06c228c1f3b3b1fbc774d78f1e7c89f7c2b54d50f0382f42',
      {
        input: {
          template_image: prompt,
          user_image: image,
        },
      }
    );

    return NextResponse.json({ image: output });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
