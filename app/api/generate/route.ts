import { NextResponse } from "next/server";
import { generateFantasyImage, mergeFaceWithScene } from "../../../utils/replicate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Incoming data:", { quizAnswers, selfieUrl });

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid quizAnswers:", quizAnswers);
      return NextResponse.json({ error: "Invalid quiz answers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      console.error("❌ Invalid selfieUrl:", selfieUrl);
      return NextResponse.json({ error: "Invalid selfie URL" }, { status: 400 });
    }

    // Step 1: Generate fantasy image
    const fantasyImage = await generateFantasyImage(quizAnswers);
    console.log("🧠 Fantasy image URL:", fantasyImage);

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    // Step 2: Merge face into fantasy scene
    console.log("📤 Sending to FaceFusion:");
    console.log("👤 Selfie URL:", selfieUrl);
    console.log("🌌 Fantasy Image URL:", fantasyImage);

    const mergedImage = await mergeFaceWithScene(selfieUrl, fantasyImage);

    if (!mergedImage) {
      return NextResponse.json({
        error: "Merged image is null",
        debug: {
          selfieUrl,
          fantasyImage,
          message: "Check if both are valid image URLs"
        }
      }, { status: 500 });
    }

    console.log("✅ Final merged image:", mergedImage);
    return NextResponse.json({ outputUrl: mergedImage });

  } catch (error) {
    console.error("❌ Error in /api/generate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
