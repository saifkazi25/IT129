import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, selfie } = body;

    if (!answers || !selfie) {
      return NextResponse.json({ error: 'Missing answers or selfie' }, { status: 400 });
    }

    // Upload selfie to Cloudinary to get a public URL
    const base64 = selfie.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const cloudinaryUpload = await uploadToCloudinary(buffer);
    const selfieUrl = cloudinaryUpload.secure_url;

    // Generate fantasy image using SDXL
    const prompt = generatePromptFromAnswers(answers);
    const fantasyImage = await runSDXL(prompt);

    if (!fantasyImage) {
      return NextResponse.json({ error: 'SDXL image generation failed' }, { status: 500 });
    }

    // Merge selfie with fantasy image using FaceFusion
    const mergedImage = await runFaceFusion({
      target: fantasyImage,
      source: selfieUrl,
    });

    if (!mergedImage) {
      return NextResponse.json({ error: 'Face fusion failed' }, { status: 500 });
    }

    return NextResponse.json({ output: mergedImage });
  } catch (err: any) {
    console.error('Error generating fantasy image:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function generatePromptFromAnswers(answers: string[]): string {
  // Simple mapping logic — you can customize this however you like
  return `A high-resolution, front-facing fantasy portrait of a ${
    answers[2]
  } in a ${answers[3]} outfit, in a beautiful ${answers[4]} setting, with a sense of ${
    answers[5]
  }, cinematic lighting, ultra-realistic, anime style`;
}
