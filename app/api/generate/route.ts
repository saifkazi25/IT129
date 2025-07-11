import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizData, selfieBase64 } = body;

    if (!quizData || !selfieBase64) {
      return NextResponse.json({ error: 'Missing quiz data or selfie' }, { status: 400 });
    }

    // ✅ Step 1: Upload selfie to Cloudinary
    const uploadedSelfie = await uploadToCloudinary(selfieBase64);
    const selfieUrl = uploadedSelfie.secure_url; // ✅ FIX: extract string

    // ✅ Step 2: Generate fantasy image
    const fantasyImage = await generateFantasyImage(quizData);

    // ✅ Step 3: Merge selfie face into fantasy image
    const mergedImage = await mergeFace(selfieUrl, fantasyImage);

    // ✅ Step 4: Return both images
    return NextResponse.json({
      fantasyImage,
      mergedImage,
    });
  } catch (error) {
    console.error('Error generating fantasy image:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
