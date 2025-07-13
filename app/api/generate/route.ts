import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const { image, quizAnswers } = await req.json();

    console.log('📥 Received quizAnswers:', quizAnswers);
    console.log('📷 Received image length:', image?.length);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length < 7) {
      throw new Error('Invalid or incomplete quizAnswers');
    }

    if (!image || typeof image !== 'string') {
      throw new Error('Invalid or missing selfie image');
    }

    const prompt = `A majestic fantasy scene showing a ${quizAnswers[2]} in a ${quizAnswers[4]} wearing ${quizAnswers[3]}. Mood: ${quizAnswers[5]}. Style: epic anime. Front-facing full-body.`;

    console.log('🧠 Final Prompt:', prompt);

    const sdxlImage = await runSDXL(prompt);
    console.log('🎨 SDXL Image generated:', sdxlImage);

    const selfieUrl = await uploadToCloudinary(image);
    console.log('☁️ Selfie uploaded to Cloudinary:', selfieUrl);

    const finalImage = await runFaceFusion(sdxlImage, selfieUrl);
    console.log('🧬 Final Fused Image:', finalImage);

    return NextResponse.json({ image: finalImage });
  } catch (error: any) {
    console.error('[ERROR IN /api/generate]', error);
    return NextResponse.json({ error: error.message || 'Image generation failed.' }, { status: 500 });
  }
}


