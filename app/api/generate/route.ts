import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfie } = body;

    // ✅ Validate inputs
    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length < 5) {
      console.error('❌ Invalid quizAnswers:', quizAnswers);
      return NextResponse.json({ error: 'Invalid or missing quiz answers' }, { status: 400 });
    }

    if (!selfie || typeof selfie !== 'string' || !selfie.startsWith('data:image')) {
      console.error('❌ Invalid selfie:', selfie?.substring(0, 50));
      return NextResponse.json({ error: 'Invalid or missing selfie image' }, { status: 400 });
    }

    // 🌩 Upload selfie to Cloudinary
    const selfieUrl = await uploadImageToCloudinary(selfie);
    console.log('✅ Uploaded selfie to Cloudinary:', selfieUrl);

    // 🎨 Run SDXL
    const fantasyPrompt = `a fantasy world with ${quizAnswers.join(', ')}, epic cinematic lighting, front-facing human character, vivid colors`;
    const fantasyImage = await runSDXL(fantasyPrompt);
    console.log('✅ SDXL fantasy image URL:', fantasyImage);

    // 🧠 Face Fusion
    const finalImage = await runFaceFusion({
      template: fantasyImage,
      user: selfieUrl,
    });
    console.log('✅ Final merged image URL:', finalImage);

    return NextResponse.json({ url: finalImage });
  } catch (err: any) {
    console.error('❌ API Error:', err.message);
    return NextResponse.json({ error: 'Something went wrong in /api/generate' }, { status: 500 });
  }
}
