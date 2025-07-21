import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '../../../utils/cloudinary';
import { generateFantasyImage } from '../../../utils/replicate';
import { runFaceFusion } from '../../../utils/facefusion';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieDataUrl } = body;

    console.log("📩 Received quizAnswers:", quizAnswers);
    console.log("📩 Received selfieDataUrl:", selfieDataUrl);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      return NextResponse.json({ error: 'Missing or invalid quizAnswers' }, { status: 400 });
    }

    if (!selfieDataUrl || !selfieDataUrl.startsWith("http")) {
      return NextResponse.json({ error: 'Missing or invalid selfie image URL' }, { status: 400 });
    }

    // Build fantasy prompt
    const prompt = `A surreal fantasy scene inspired by: ${quizAnswers.join(', ')}. High detail, fantasy art, full-body front-facing character, soft light, epic style`;

    console.log("🧠 Built SDXL prompt:", prompt);

    // Step 1: Generate fantasy background
    let fantasyImageUrl = '';
    try {
      fantasyImageUrl = await generateFantasyImage({ prompt });
      console.log("🖼️ Fantasy image generated:", fantasyImageUrl);
    } catch (error: any) {
      console.error("❌ SDXL generation error:", error);
      return NextResponse.json({ error: 'Failed to generate fantasy image', details: error.message }, { status: 500 });
    }

    if (!fantasyImageUrl) {
      return NextResponse.json({ error: 'Fantasy image was empty' }, { status: 500 });
    }

    // Step 2: Merge face with fantasy image
    let mergedImageUrl = '';
    try {
      mergedImageUrl = await runFaceFusion(selfieDataUrl, fantasyImageUrl);
      console.log("🧬 FaceFusion merged image:", mergedImageUrl);
    } catch (error: any) {
      console.error("❌ FaceFusion error:", error);
      return NextResponse.json({ error: 'Failed to merge face into fantasy image', details: error.message }, { status: 500 });
    }

    if (!mergedImageUrl) {
      return NextResponse.json({ error: 'Merged image URL is missing' }, { status: 500 });
    }

    return NextResponse.json({ mergedImageUrl });
  } catch (error) {
    console.error("🔥 Unexpected API error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
