import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const selfieFile = formData.get('selfie') as File;
    const prompt = formData.get('prompt') as string;

    if (!selfieFile || !prompt) {
      return NextResponse.json(
        { error: 'Missing selfie or prompt' },
        { status: 400 }
      );
    }

    // ✅ Step 1: Upload selfie to Cloudinary
    const buffer = Buffer.from(await selfieFile.arrayBuffer());
    const selfieUploadResult = await uploadToCloudinary(buffer);
    const selfieUrl = selfieUploadResult.secure_url;

    // ✅ Step 2: Generate fantasy image from prompt
    const fantasyImage = await generateFantasyImage(prompt);

    // ✅ Step 3: Merge selfie face into fantasy image
    const mergedImage = await mergeFace(selfieUrl, fantasyImage);

    // ✅ Step 4: Return both images
    return NextResponse.json({
      fantasyImage,
      mergedImage,
    });
  } catch (error) {
    console.error('Error generating fantasy image:', error);
    return NextResponse.json(
      { error: 'Failed to generate fantasy image' },
      { status: 500 }
    );
  }
}
