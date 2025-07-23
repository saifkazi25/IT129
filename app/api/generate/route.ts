import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { mergeFaces } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text(); // Fix: read raw text body
    const { quizAnswers, selfieUrl } = JSON.parse(bodyText); // Then parse as JSON

    console.log('📥 Incoming quizAnswers:', quizAnswers);
    console.log('📥 Incoming selfieUrl:', selfieUrl);

    // Validate input
    if (!quizAnswers || quizAnswers.length !== 7 || !selfieUrl) {
      console.error('❌ Missing input data', { quizAnswers, selfieUrl });
      return NextResponse.json(
        { message: 'Missing quiz answers or selfie URL' },
        { status: 400 }
      );
    }

    // Step 1: Generate fantasy image with SDXL
    const prompt = `A fantasy portrait of a person in a surreal world inspired by: ${quizAnswers.join(
      ', '
    )}, cinematic lighting, ultra-detailed, 4k, front-facing face, vivid colors`;
    console.log('📝 SDXL Prompt:', prompt);

    const fantasyImage = await generateFantasyImage(prompt);
    console.log('✨ SDXL fantasy image generated:', fantasyImage);

    // Step 2: Upload fantasy image to Cloudinary
    const fantasyImageUrl = await uploadImageToCloudinary(fantasyImage);
    console.log('☁️ Uploaded fantasy image to Cloudinary:', fantasyImageUrl);

    // Step 3: Merge with user selfie using FaceFusion
    const mergedImageUrl = await mergeFaces(selfieUrl, fantasyImageUrl);
    console.log('🧬 Final merged image URL:', mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (err: any) {
    console.error('🔥 /api/generate error:', err);
    return NextResponse.json(
      { message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
