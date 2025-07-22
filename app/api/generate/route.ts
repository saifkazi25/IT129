import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { mergeWithFaceFusion } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    // Detailed validations
    if (!quizAnswers) {
      return NextResponse.json({ error: 'Missing quizAnswers' }, { status: 400 });
    }
    if (!Array.isArray(quizAnswers)) {
      return NextResponse.json({ error: 'quizAnswers must be an array' }, { status: 400 });
    }
    if (quizAnswers.length !== 7) {
      return NextResponse.json({ error: `quizAnswers must contain 7 items, received ${quizAnswers.length}` }, { status: 400 });
    }
    if (!selfieUrl) {
      return NextResponse.json({ error: 'Missing selfieUrl' }, { status: 400 });
    }

    console.log('🔮 Generating fantasy image...');
    const fantasyImageUrl = await generateFantasyImage(quizAnswers);
    console.log('✅ Fantasy image URL:', fantasyImageUrl);

    console.log('🌀 Merging with FaceFusion...');
    const mergedImageUrl = await mergeWithFaceFusion(selfieUrl, fantasyImageUrl);
    console.log('✅ Merged image URL:', mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error('❌ Unexpected error in /api/generate:', error);
    return NextResponse.json({ error: error.message || 'Unexpected server error' }, { status: 500 });
  }
}
