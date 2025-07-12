import { NextResponse } from 'next/server';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';
import { uploadToCloudinary } from '../../../utils/cloudinary';

export async function POST(req: Request) {
  try {
    const { answers, selfie } = await req.json();

    if (!answers || !selfie) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const prompt = `A majestic fantasy scene with ${answers.q2} in a ${answers.q3}, set in ${answers.q4}. Mood: ${answers.q5}, Style: ${answers.q6}`;
    const fantasyImageUrl = await generateFantasyImage(prompt);

    // Upload selfie to Cloudinary
    const selfieBuffer = Buffer.from(selfie.split(',')[1], 'base64');
    const uploadedSelfie = await uploadToCloudinary(selfieBuffer);

    // Merge the face
    const finalImageUrl = await mergeFace(fantasyImageUrl, uploadedSelfie.secure_url);

    return NextResponse.json({
      fantasyImage: fantasyImageUrl,
      mergedImage: finalImageUrl,
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
