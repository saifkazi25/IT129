import { NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { mergeFaces } from '../../../utils/facefusion';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // ✅ Use JSON body parsing

    const { quizAnswers, selfieUrl } = body;

    console.log('✅ Received payload in /api/generate:', { quizAnswers, selfieUrl });

    // Input validation
    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error('❌ Invalid or missing quizAnswers:', quizAnswers);
      return NextResponse.json(
        { message: 'Missing or invalid quiz answers' },
        { status: 400 }
      );
    }

    if (!selfieUrl || typeof selfieUrl !== 'string') {
      console.error('❌ Invalid or missing selfieUrl:', selfieUrl);
      return NextResponse.json(
        { message: 'Missing or invalid selfie URL' },
        { status: 400 }
      );
    }

    // Step 1: Generate fantasy image using SDXL
    console.log('✨ Calling SDXL...');
    const fantasyImageUrl = await generateFantasyImage(quizAnswers);
    console.log('🖼️ SDXL fantasy image URL:', fantasyImageUrl);

    if (!fantasyImageUrl) {
      throw new Error('Fantasy image generation failed');
    }

    // Step 2: Merge fantasy image + selfie using FaceFusion
    console.log('🤖 Calling FaceFusion...');
    const mergedImageUrl = await mergeFaces(fantasyImageUrl, selfieUrl);
    console.log('🧠 Final merged image URL:', mergedImageUrl);

    if (!mergedImageUrl) {
      throw new Error('Face merging failed');
    }

    // Return final merged image
    return NextResponse.json({ mergedImageUrl });

  } catch (error: any) {
    console.error('❌ Error in /api/generate:', error);
    return NextResponse.json(
      { message: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
