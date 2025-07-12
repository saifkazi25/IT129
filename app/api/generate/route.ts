import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage, mergeFace } from '../../../utils/replicate';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ✅ Get the image and prompt from the form
    const selfieFile = formData.get('image') as File;
    const promptString = formData.get('prompt') as string;
    if (!selfieFile || !promptString) {
      return NextResponse.json({ error: 'Missing selfie or prompt' }, { status: 400 });
    }

    const promptObj = JSON.parse(promptString);
    const prompt = generatePromptFromAnswers(promptObj);

    // ✅ Step 1: Upload selfie to Cloudinary
    const arrayBuffer = await selfieFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer as ArrayBuffer);
    const selfieUploadResult = await uploadToCloudinary(buffer);
    const selfieUrl = selfieUploadResult.secure_url;

    // ✅ Step 2: Generate fantasy image from prompt
    const fantasyImage = await generateFantasyImage(prompt);
    if (!fantasyImage) throw new Error('Fantasy image generation failed');

    // ✅ Step 3: Merge the face using FaceFusion
    const mergedImage = await mergeFace(fantasyImage, selfieUrl);
    if (!mergedImage) throw new Error('Face merge failed');

    // ✅ Return both URLs to frontend
    return NextResponse.json({ fantasyImage, mergedImage });
  } catch (err) {
    console.error('Error generating fantasy image:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// 🧠 Convert quiz answers into an AI prompt for SDXL
function generatePromptFromAnswers(answers: Record<string, string>): string {
  const { q0, q1, q2, q3, q4, q5, q6 } = answers;

  return `a cinematic, high-detail scene of a ${q2} wearing ${q3}, in a ${q4} environment, with a ${q0} vibe, located in ${q1}, embarking on a ${q5} journey involving ${q6}. full body, centered character, fantasy atmosphere, clear front-facing face, hyper realistic, trending on artstation`;
}
