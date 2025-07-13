import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const { image, quizAnswers } = await req.json();

    const prompt = `A majestic fantasy scene showing a ${quizAnswers[2]} in a ${quizAnswers[4]} wearing ${quizAnswers[3]}. Mood: ${quizAnswers[5]}. Style: epic anime. Front-facing full-body.`;
    const sdxlImage = await runSDXL(prompt);

    const selfieUrl = await uploadToCloudinary(image);
    const finalImage = await runFaceFusion(sdxlImage, selfieUrl);

    return NextResponse.json({ image: finalImage });
  } catch (error) {
    console.error('[ERROR IN /api/generate]', error);
    return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
  }
}

