import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const { answers, selfieImage } = await req.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 7 || !selfieImage) {
      return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 });
    }

    // 1. Generate fantasy image with SDXL
    const fantasyImage = await generateFantasyImage(answers);

    // 2. Upload selfie to Cloudinary
    const uploadedSelfie = await uploadToCloudinary(selfieImage);

    if (!uploadedSelfie?.secure_url) {
      return NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 500 });
    }

    // 3. Merge face with FaceFusion
    const finalImage = await mergeFace({
      sourceImage: uploadedSelfie.secure_url,
      targetImage: fantasyImage,
    });

    return NextResponse.json({ image: finalImage });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
