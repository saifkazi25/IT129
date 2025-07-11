import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { answers, selfieImage } = data;

    if (!answers || !selfieImage) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 1. Generate fantasy image with SDXL
    const fantasyImage = await generateFantasyImage(answers);

    // 2. Convert selfie from base64 to Buffer
    const base64Data = selfieImage.replace(/^data:image\/\w+;base64,/, '');
    const selfieBuffer = Buffer.from(base64Data, 'base64');

    // 3. Upload selfie to Cloudinary
    const uploadedSelfie = await uploadToCloudinary(selfieBuffer);

    if (!uploadedSelfie?.secure_url) {
      return NextResponse.json({ error: 'Failed to upload selfie' }, { status: 500 });
    }

    // 4. Merge face with fantasy image
    const finalImage = await mergeFace(fantasyImage, uploadedSelfie.secure_url);

    return NextResponse.json({ image: finalImage });
  } catch (err) {
    console.error('Error generating fantasy image:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
