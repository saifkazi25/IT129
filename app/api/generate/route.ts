import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { mergeFaceIntoImage } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    // Input validations
    if (!quizAnswers) {
      return NextResponse.json({ error: 'Missing quizAnswers' }, { status: 400 });
    }
    if (!Array.isArray(quizAnswers)) {
      return NextResponse.json({ error: 'quizAnswers must be an array' }, { status: 400 });
    }
    if (quizAnswers.length !== 7) {
      return NextResponse.json({
        error: `quizAnswers must contain 7 items, received ${quizAnswers.length}`,
      }, { status: 400 });
    }
    if (!selfieUrl) {
      return NextResponse.json({ error: 'Missing selfieUrl' }, { status: 400 });
    }

    // Turn quizAnswers into a prompt string
    const prompt = quizAnswers.join(', ');
    console.log('🔮 Prompt:', prompt);

    // Pass the prompt object to SDXL
    const fantasyImageUrl = await generateFantasyImage({ prompt });
    console.log('✅ Fantasy Image:', fantasyImageUrl);

    // Face fusion
    const mergedImageUrl = await mergeFaceIntoImage({
      targetImageUrl: fantasyImageUrl,
      faceImageUrl: selfieUrl,
    });

    console.log('🌟 Final Merged Image:', mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error('❌ Error in /api/generate:', error);
    return NextResponse.json({
      error: error.message || 'Unexpected server error',
    }, { status: 500 });
  }
}
