import { NextResponse, NextRequest } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!, // ↩️  ensure this env-var exists in Vercel
});

export async function POST(req: NextRequest) {
  try {
    const { answers, image } = await req.json() as {
      answers?: string[];
      image?: string;
    };

    // ---------- validation ---------- //
    if (!image) {
      return NextResponse.json(
        { error: '🖼️  Missing "image" (base64 selfie).' },
        { status: 400 },
      );
    }

    if (!Array.isArray(answers) || answers.length !== 7) {
      return NextResponse.json(
        { error: '❓ "answers" must be an array of 7 items.' },
        { status: 400 },
      );
    }

    // ---------- prompt ---------- //
    const prompt = `Create a vivid fantasy portrait of this person in a setting featuring: ${answers.join(
      ', ',
    )}. High detail, cinematic lighting, concept-art style.`;

    console.log('🔮  Calling Replicate with prompt:', prompt.slice(0, 120));

    // ---------- call Replicate ---------- //
    // NOTE: FaceFusion model requires both the model slug AND the version hash.
    const output: string[] = await replicate.run(
      'lucataco/modelscope-facefusion:db21c1c7db5f8eb85846c55d9298760e72123708f3420f9ef1f07121feb248c34',
      {
        input: {
          template: 'stabilityai/stable-diffusion-xl',
          target_image: image,
          prompt,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      },
    );

    // Replicate usually returns an array of image URLs.
    console.log('✅  Replicate finished, first URL:', output?.[0]);

    return NextResponse.json({ imageUrl: output?.[0] ?? null });
  } catch (err) {
    console.error('❌  Replicate API error:', err);
    return NextResponse.json(
      { error: 'Failed to generate fantasy image.' },
      { status: 500 },
    );
  }
}
