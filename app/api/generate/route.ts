import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceIntoImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7 || !selfieUrl) {
      return NextResponse.json({ error: "Missing quizAnswers or selfieUrl" }, { status: 400 });
    }

    // Build prompt string from quiz answers
    const prompt = `A fantasy portrait of a person in a world with ${quizAnswers.join(
      ", "
    )}, cinematic, magical, ultra-detailed`;

    console.log("🎯 Prompt for SDXL:", prompt);

    // Generate fantasy world image
    const fantasyImage = await generateFantasyImage({ prompt });
    console.log("🎨 Fantasy image:", fantasyImage);

    // Merge selfie into the fantasy image
    const finalImageUrl = await mergeFaceIntoImage({
      targetImageUrl: fantasyImage,
      faceImageUrl: selfieUrl,
    });
    console.log("🌟 Final merged image URL:", finalImageUrl);

    return NextResponse.json({ finalImageUrl });
  } catch (error: any) {
    console.error("🔥 Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
