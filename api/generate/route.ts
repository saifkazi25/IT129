import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { q0, q1, q2, q3, q4, q5, q6, image } = body;

    if (!image || [q0, q1, q2, q3, q4, q5, q6].some((q) => !q)) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // 🧠 Step 1: Generate fantasy prompt from quiz answers
    const fantasyPrompt = `A fantasy scene of a person who dreams of ${q0}, in a world like ${q1}, styled as a ${q2}, wearing ${q3}, set in ${q4}, living a life of ${q5}, with the power of ${q6}`;

    // 🧬 Step 2: Generate fantasy image
    const fantasyImageOutput = await replicate.run(
      'stability-ai/sdxl:8abfa7cf048c840f49b27870b84d0057640c137c29377c3f5aebfc2c62b40352',
      {
        input: {
          prompt: fantasyPrompt,
          width: 512,
          height: 512,
        },
      }
    );

    const fantasyImageUrl = Array.isArray(fantasyImageOutput)
      ? fantasyImageOutput[0]
      : fantasyImageOutput;

    // 🧑‍🎤 Step 3: Face fusion with selfie
    const finalImageOutput = await replicate.run(
      'lucataco/modelscope-facefusion:db21c1c7db5f8eb85846c55d9298760e72123708f3420f9ef1f522d2ec1690ce',
      {
        input: {
          target_image: fantasyImageUrl,
          source_image: image,
        },
      }
    );

    const finalImageUrl = Array.isArray(finalImageOutput)
      ? finalImageOutput[0]
      : finalImageOutput;

    return NextResponse.json({ imageUrl: finalImageUrl });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
