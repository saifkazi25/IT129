import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFaceWithFantasy } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfie } = await req.json();

    if (!quizAnswers || !selfie) {
      return NextResponse.json({ error: 'Missing quiz or selfie data.' }, { status: 400 });
    }

    // Step 1: Upload selfie to Cloudinary
    const selfieUrl = await uploadImageToCloudinary(selfie);

    // Step 2: Generate fantasy image with SDXL using quiz answers
    const prompt = generateFantasyPrompt(quizAnswers);
    const fantasyImageUrl = await generateFantasyImage(prompt);

    // Step 3: Merge user selfie into fantasy image using FaceFusion
    const finalImageUrl = await mergeFaceWithFantasy(selfieUrl, fantasyImageUrl);

    return NextResponse.json({ image: finalImageUrl });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

function generateFantasyPrompt(answers: string[]): string {
  return `
    a highly detailed cinematic illustration of a person in a surreal fantasy world.
    The setting is: ${answers[1]}.
    Their role is: ${answers[2]}.
    They are wearing: ${answers[3]}.
    The environment around them includes: ${answers[4]}.
    The vibe is: ${answers[5]}.
    The power they have is: ${answers[6]}.
    Photorealistic, high-resolution, front-facing portrait, masterpiece, 8K.
  `.trim();
}
