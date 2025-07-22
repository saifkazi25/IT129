import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { mergeFaceIntoImage } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7 || !selfieUrl) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const prompt = `fantasy portrait of a person in a dream world, elements: ${quizAnswers.join(
      ', '
    )}, centered, dramatic lighting, front-facing face, ultra detailed, high fantasy`;

    console.log('🔮 Prompt:', prompt);

    const fantasyImageUrl = await generateFantasyImage({ prompt });
    console.log('✅ Fantasy Image:', fantasyImageUrl);

    const mergedImageUrl = await mergeFaceIntoImage({
      target: fantasyImageUrl,
      source: selfieUrl,
    });

    console.log('🧠 Final Merged Image:', mergedImageUrl);

    return NextResponse.json({ finalImageUrl: mergedImageUrl });
  } catch (err) {
    console.error('❌ API Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
