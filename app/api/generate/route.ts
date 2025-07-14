import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const { image, quizAnswers } = await req.json();

    if (!image || !Array.isArray(quizAnswers) || quizAnswers.length < 7) {
      return NextResponse.json(
        { error: 'Missing selfie or quiz answers.' },
        { status: 400 }
      );
    }

    // Build the fantasy prompt
    const prompt = `A majestic fantasy scene showing a ${quizAnswers[2]} `
      + `in a ${quizAnswers[4]} wearing ${quizAnswers[3]}. `
      + `Mood: ${quizAnswers[5]}. Style: epic anime. Front-facing full-body.`;

    console.log('🧠 Prompt:', prompt);

    // 1️⃣ Generate fantasy background
    const sdxlImage = await runSDXL(prompt);
    console.log('🎨 SDXL:', sdxlImage);

    // 2️⃣ Upload selfie
    const selfieUrl = await uploadToCloudinary(image);
    console.log('☁️ Cloudinary selfie:', selfieUrl);

    // 3️⃣ Face-fuse
    const mergedImage = await runFaceFusion(sdxlImage, selfieUrl);
    console.log('🧬 Final merged:', mergedImage);

    // ✅ Return under the key the front-end expects
    return NextResponse.json({ mergedImage });
  } catch (err: any) {
    console.error('[ERROR /api/generate]', err);
    return NextResponse.json(
      { error: 'Image generation failed.' },
      { status: 500 }
    );
  }
}

