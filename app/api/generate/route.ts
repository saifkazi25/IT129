import { NextResponse } from "next/server";
import { generateFantasyImage, mergeFaceIntoImage } from "../../../utils/replicate";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !quizAnswers.length || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing quiz answers or selfie" },
        { status: 400 }
      );
    }

    console.log("✅ Received quizAnswers:", quizAnswers);
    console.log("✅ Received selfieUrl:", selfieUrl);

    // 1. Generate fantasy image using SDXL
    const fantasyImageUrl = await generateFantasyImage(quizAnswers);
    console.log("🎨 SDXL fantasy image URL:", fantasyImageUrl);

    // 2. Merge user's face into the fantasy image
    const finalImageUrl = await mergeFaceIntoImage({
      sourceImage: fantasyImageUrl,
      targetFace: selfieUrl,
    });
    console.log("🧬 Final merged image URL:", finalImageUrl);

    return NextResponse.json({ imageUrl: finalImageUrl });
  } catch (error) {
    console.error("❌ Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
