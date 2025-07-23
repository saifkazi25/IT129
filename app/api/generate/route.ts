import { NextRequest, NextResponse } from 'next/server';
import { generateFantasyImage } from '../../../utils/replicate';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { mergeFaces } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text(); // Read raw body as text
    const { quizAnswers, selfieUrl } = JSON.parse(bodyText); // Parse JSON manually

    console.log('📥 Incoming quizAnswers:', quizAnswers);
    console.log('📥 Incoming selfieUrl:', selfieUrl);

    // Validate input
    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7 || !selfieUrl) {
      console.error('❌ Missing or invalid input data', { quizAnswers, selfieUrl });
      return NextResponse.json(
        { message: 'Missing quiz answers or selfie URL' },
        { status: 400 }
      );
    }

    // Step 1: Generate fantasy image with SDXL using quiz answers
    const fantasyImage = await generateFantasyImage(quizAnswers);
    console.log('✨ SDXL fantasy image generated:', fantasyImage);

    if (!fantasyImage) {
      throw new Error('Fantasy image generation failed');
    }

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
