import { NextResponse } from 'next/server';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';
import { uploadToCloudinary } from '../../../utils/cloudinary';

export async function POST(req: Request) {
  try {
    // ✅ Parse incoming JSON
    const { answers, selfie } = await req.json();

    if (!answers || !selfie) {
      return NextResponse.json({ error: 'Missing answers or selfie' }, { status: 400 });
    }

    // ✅ Convert base64 selfie to buffer
    const base64Data = selfie.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // ✅ Upload selfie to Cloudinary
    const selfieUploadResult = await uploadToCloudinary(buffer);
    const selfieUrl = selfieUploadResult.secure_url;

    // ✅ Turn answers into a prompt string
    const prompt = answers.join(', '); // or customize with creative phrasing

    // ✅ Generate fantasy image from prompt
    const fantasyImage = await generateFantasyImage(prompt);

    // ✅ Merge selfie into fantasy image
    const mergedImage = await mergeFace(fantasyImage, selfieUrl);

    // ✅ Return both images to frontend
    return NextResponse.json({
      fantasyImage,
      mergedImage,
    });
  } catch (err) {
    console.error('Error generating fantasy image:', err);
    return NextResponse.json({ error: 'Failed to generate fantasy image' }, { status: 500 });
  }
}
