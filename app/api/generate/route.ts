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

    // Generate fantasy text for logging
    const fantasyText = answers.join(', ');
    console.log('📨 Fantasy prompt:', fantasyText);

    // Use Replicate's modelscope-facefusion which needs:
    // - target_image: your selfie
    // - template_image: some image to blend with (we'll use a fantasy sample)

    const fantasyTemplate = "https://replicate.delivery/pbxt/WL2kqzcoFYyo53XgC7vVlZarRn1YJZyEqJxErGBF0UdK1lQA/fantasy_template.jpg";

    const output = await replicate.run(
      "lucataco/modelscope-facefusion:14b80471165f13b3e73b3aecee30573583b9a3293d025d3b25623a54cbe7e3e6",
      {
        input: {
          target_image: image,
          template_image: fantasyTemplate,
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
