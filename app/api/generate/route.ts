import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFaceWithFantasy } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const quizAnswers = JSON.parse(formData.get('quizAnswers') as string);
    const selfieFile = formData.get('selfie') as File;

    if (!quizAnswers || !selfieFile) {
      return NextResponse.json({ error: 'Missing quiz answers or selfie' }, { status: 400 });
    }

    console.log('📥 Received quizAnswers:', quizAnswers);
    const selfieArrayBuffer = await selfieFile.arrayBuffer();
    const selfieBuffer = Buffer.from(selfieArrayBuffer);
    console.log('📷 Received image length:', selfieBuffer.length);

    // Final Prompt
    let prompt = `A majestic fantasy scene showing a ${quizAnswers[2]} in a ${quizAnswers[4]} wearing ${quizAnswers[3]}. `
      + `Mood: ${quizAnswers[5]}. Style: epic anime. Front-facing full-body.`;

    console.log('🧠 Prompt:', prompt);

    let sdxlImageUrl;
    try {
      const output = await generateFantasyImage(prompt);
      sdxlImageUrl = output[0];
    } catch (err: any) {
      if (err.message?.includes('NSFW')) {
        console.warn('⚠️ NSFW block — retrying with slight variation...');
        const safePrompt = prompt + ' Safe for work. No nudity. Fully clothed. Family friendly.';
        const output = await generateFantasyImage(safePrompt);
        sdxlImageUrl = output[0];
      } else {
        console.error('[ERROR /api/generate]', err);
        return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
      }
    }

    console.log('🎨 SDXL Image generated:', sdxlImageUrl);

    const selfieUrl = await uploadImageToCloudinary(selfieBuffer);
    console.log('☁️ Selfie uploaded to Cloudinary:', selfieUrl);

    const mergedImage = await mergeFaceWithFantasy(selfieUrl, sdxlImageUrl);
    console.log('🧬 Final Fused Image:', mergedImage);

    return NextResponse.json({ mergedImage });
  } catch (err) {
    console.error('[ERROR IN /api/generate]', err);
    return NextResponse.json({ error: 'Server error during image generation' }, { status: 500 });
  }
}
