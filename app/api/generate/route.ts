import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: NextRequest) {
  try {
    const { answers, selfie } = await req.json();

    if (!answers || !selfie) {
      return NextResponse.json({ error: 'Missing answers or selfie' }, { status: 400 });
    }

    // 1. Generate fantasy image using SDXL
    const prompt = `A stunning fantasy world with themes: ${answers.join(', ')}. Full body or upper body view of a heroic figure, cinematic lighting, highly detailed, ultra realistic, front-facing face clearly visible`;
    const sdxlImageUrl = await runSDXL(prompt);

    // 2. Upload selfie to Cloudinary
    const selfieBuffer = Buffer.from(selfie.split(',')[1], 'base64');
    const cloudinaryUpload = await uploadToCloudinary(selfieBuffer);

    const selfieUrl = cloudinaryUpload.secure_url;

    if (!selfieUrl || !sdxlImageUrl) {
      return NextResponse.json({ error: 'Image URLs missing' }, { status: 500 });
    }

    // 3. Run FaceFusion with SDXL image (target) and selfie (source)
    const finalImageUrl = await runFaceFusion({
      source: selfieUrl,
      target: sdxlImageUrl,
    });

    return NextResponse.json({ image: finalImageUrl });
  } catch (err) {
    console.error('Error generating fantasy image:', err);
    return NextResponse.json({ error: 'Failed to generate fantasy image' }, { status: 500 });
  }
}
