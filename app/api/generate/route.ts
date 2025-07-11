import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    const { prompt, selfie } = reqBody;

    // 🔥 Ensure prompt is a string
    const promptText = Array.isArray(prompt) ? prompt.join(', ') : prompt;

    // ✅ Step 1: Generate fantasy image
    const fantasyImage = await generateFantasyImage(promptText);

    // ✅ Step 2: Upload selfie to Cloudinary
    const selfieUrl = await uploadToCloudinary(selfie);

    // ✅ Step 3: Merge selfie face into fantasy image
    const mergedImage = await mergeFace(selfieUrl, fantasyImage);

    // ✅ Return both images
    return NextResponse.json({
      fantasyImage,
      mergedImage,
    });
  } catch (error) {
    console.error('Error generating fantasy image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
