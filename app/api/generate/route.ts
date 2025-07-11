import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const prompt = formData.get('prompt') as string;
    const selfieFile = formData.get('selfie') as File;

    if (!prompt || !selfieFile) {
      return NextResponse.json({ error: 'Missing prompt or selfie' }, { status: 400 });
    }

    // ✅ Step 1: Upload selfie to Cloudinary
    const arrayBuffer = await selfieFile.arrayBuffer();
    const buffer: Buffer = Buffer.from(arrayBuffer as ArrayBuffer);
    const selfieUploadResult = await uploadToCloudinary(buffer);
    const selfieUrl = selfieUploadResult.secure_url;

    // ✅ Step 2: Generate fantasy image from prompt
    const fantasyImage = await generateFantasyImage(prompt);

    // ✅ Step 3: Merge selfie face into fantasy image
    const mergedImage = await mergeFace(fantasyImage, selfieUrl);

    // ✅ Return both images
    return NextResponse.json({
      fantasyImage,
      mergedImage,
    });
  } catch (error) {
    console.error('Error generating fantasy image:', error);
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
  }
}
