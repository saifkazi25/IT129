import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { mergeFaces } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    // ✅ FIX: Parse as JSON directly (was: req.text())
    const { quizAnswers, selfieUrl } = await req.json();

    console.log('📥 Incoming quizAnswers:', quizAnswers);
    console.log('📸 Incoming selfieUrl:', selfieUrl);

    if (!quizAnswers || quizAnswers.length !== 7 || !selfieUrl) {
      console.error('❌ Missing input data', { quizAnswers, selfieUrl });
      return NextResponse.json(
        { message: 'Missing quiz answers or selfie URL' },
        { status: 400 }
      );
    }

    const prompt = `A fantasy portrait of a person in a surreal world inspired by: ${quizAnswers.join(
      ', '
    )}, cinematic lighting, ultra-detailed, 4k, front-facing face, vivid colors`;
    console.log('📝 SDXL Prompt:', prompt);

    const fantasyImage = await generateFantasyImage(prompt);
    console.log('✨ SDXL fantasy image generated:', fantasyImage);

    const fantasyImageUrl = await uploadImageToCloudinary(fantasyImage);
    console.log('☁️ Uploaded fantasy image to Cloudinary:', fantasyImageUrl);

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
