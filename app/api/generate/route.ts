import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFaceWithFantasy } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfie } = body;

    if (!quizAnswers || !selfie) {
      console.warn('⚠️ Missing quiz answers or selfie.');
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    console.log('📥 Received quizAnswers:', quizAnswers);
    console.log('📷 Received image length:', selfie.length);

    const [q1, q2, q3, q4, q5, q6, q7] = quizAnswers;
    const prompt = `A majestic fantasy scene showing a ${q3} in a ${q5} wearing ${q4}. Mood: ${q6}. Style: epic anime. Front-facing full-body.`;

    console.log('🧠 Prompt:', prompt);

    // First try fantasy image generation
    let fantasyImageUrl: string;
    try {
      fantasyImageUrl = await generateFantasyImage(prompt);
    } catch (err: any) {
      if (err.message?.includes('NSFW')) {
        console.warn('⚠️ NSFW block — retrying with slight variation...');
        const safePrompt = `${prompt} (safe, clean version)`;
        fantasyImageUrl = await generateFantasyImage(safePrompt);
      } else {
        throw err;
      }
    }

    console.log('🎨 SDXL Image generated:', fantasyImageUrl);

    // Upload selfie to Cloudinary
    const selfieUrl = await uploadToCloudinary(selfie);
    console.log('☁️ Selfie uploaded to Cloudinary:', selfieUrl);

    // Merge face
    const mergedImage = await mergeFaceWithFantasy(selfieUrl, fantasyImageUrl);
    console.log('🧪 Raw FaceFusion output:', mergedImage);

    return NextResponse.json({ mergedImage });
  } catch (error) {
    console.error('[ERROR /api/generate]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
