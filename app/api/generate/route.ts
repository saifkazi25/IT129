import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { runSDXL, runFaceFusion } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieDataUrl } = await req.json();

    console.log('✅ Incoming quizAnswers:', quizAnswers);
    console.log('✅ Incoming selfieDataUrl:', selfieDataUrl?.substring(0, 50));

    if (!quizAnswers || !selfieDataUrl) {
      console.error('❌ Missing input data', { quizAnswers, selfieDataUrl });
      return NextResponse.json({ error: 'Missing input data' }, { status: 400 });
    }

    // Upload selfie to Cloudinary
    const uploadedSelfieUrl = await uploadToCloudinary(selfieDataUrl);
    console.log('☁️ Uploaded selfie URL:', uploadedSelfieUrl);

    // Run SDXL to generate fantasy background image
    const fantasyImageUrl = await runSDXL(quizAnswers);
    console.log('🎨 SDXL image URL:', fantasyImageUrl);

    // Run FaceFusion to merge the face
    const finalImageUrl = await runFaceFusion(uploadedSelfieUrl, fantasyImageUrl);
    console.log('🧠 Final image URL:', finalImageUrl);

    return NextResponse.json({ imageUrl: finalImageUrl }, { status: 200 });

  } catch (error) {
    console.error('🔥 Error in /api/generate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
