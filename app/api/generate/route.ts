import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { runFaceFusion } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieDataUrl } = body;

    console.log('📩 Received quizAnswers:', quizAnswers);
    console.log('📩 Received selfieDataUrl:', selfieDataUrl);

    // 1. Build fantasy prompt
    const prompt = `A surreal fantasy scene inspired by: ${quizAnswers.join(
      ', '
    )}. High detail, fantasy art, full-body front-facing character, soft light, epic style`;

    console.log('🧠 Built SDXL prompt:', prompt);

    // 2. Generate fantasy image using SDXL (FIXED!)
    const fantasyImageUrl = await generateFantasyImage({ prompt });
    console.log('🖼️ Fantasy image generated:', fantasyImageUrl);

    // 3. Merge face using FaceFusion
    let mergedImageUrl = '';
    try {
      mergedImageUrl = await runFaceFusion({
        selfieUrl: selfieDataUrl,
        fantasyImageUrl,
      });
      console.log('🧬 FaceFusion merged image:', mergedImageUrl);
    } catch (error: any) {
      console.error('❌ FaceFusion error:', error);
      return NextResponse.json(
        { error: 'Failed to merge face into fantasy image', details: error.message },
        { status: 500 }
      );
    }

    // 4. Return result
    return NextResponse.json({
      success: true,
      fantasyImageUrl,
      mergedImageUrl,
    });
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Something went wrong', details: error.message },
      { status: 500 }
    );
  }
}
