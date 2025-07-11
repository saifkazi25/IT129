import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const answers = JSON.parse(formData.get('answers') as string);
    const selfieImage = formData.get('selfie') as File;

    if (!answers || !selfieImage) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 1. Generate fantasy image with SDXL
    const prompt = `A fantasy illustration of a person in a ${answers.join(', ')} world, vibrant colors, cinematic lighting, highly detailed, front-facing full portrait`;
    const fantasyImage = await generateFantasyImage(prompt);

    if (!fantasyImage) {
      return NextResponse.json({ error: 'Failed to generate fantasy image' }, { status: 500 });
    }

    // 2. Upload selfie to Cloudinary
    const uploadedSelfie = await uploadToCloudinary(selfieImage);

    if (!uploadedSelfie?.secure_url) {
      return NextResponse.json({ error: 'Failed to upload selfie' }, { status: 500 });
    }

    // 3. Merge face using FaceFusion
    const finalImage = await mergeFace({
      target: fantasyImage,
      source: uploadedSelfie.secure_url,
    });

    if (!finalImage) {
      return NextResponse.json({ error: 'Failed to merge face' }, { status: 500 });
    }

    return NextResponse.json({ image: finalImage });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
