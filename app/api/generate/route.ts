import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage } from '../../../utils/replicate';
import { runFaceFusion } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieDataUrl } = body;

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      return NextResponse.json({ error: 'Missing or invalid quizAnswers' }, { status: 400 });
    }

    if (!selfieDataUrl) {
      return NextResponse.json({ error: 'Missing selfie image' }, { status: 400 });
    }

    // Step 1: Upload selfie to Cloudinary
    const selfieUrl = await uploadImageToCloudinary(selfieDataUrl);
    console.log('✅ Cloudinary upload success:', selfieUrl);

    // Step 2: Build prompt from quiz answers
    const prompt = `A highly detailed, surreal fantasy scene featuring ${quizAnswers.join(', ')}, cinematic lighting, epic composition, fantasy digital art, front-facing character`;

    // Step 3: Generate fantasy background image with SDXL
    let fantasyImageUrl = '';
    let attempt = 0;
    let sdxlError = '';

    while (attempt < 2) {
      try {
        console.log(`🪄 Attempt ${attempt}: generating fantasy image...`);
        fantasyImageUrl = await generateFantasyImage({ prompt });
        if (fantasyImageUrl) break;
      } catch (err: any) {
        sdxlError = err.message || "Unknown error from SDXL";
        console.error("❌ SDXL generation error:", sdxlError);
      }
      attempt++;
    }

    if (!fantasyImageUrl) {
      return NextResponse.json({ error: 'Failed to generate fantasy image', details: sdxlError }, { status: 500 });
    }

    console.log('✅ Fantasy image URL:', fantasyImageUrl);

    // Step 4: Merge selfie with fantasy image
    const mergedImageUrl = await runFaceFusion(selfieUrl, fantasyImageUrl);
    console.log('✅ Merged image URL:', mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
