import { NextResponse } from "next/server";
import { generateFantasyImage, mergeFaceWithScene } from "../../../utils/replicate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Incoming payload:", { quizAnswers, selfieUrl });

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid quizAnswers:", quizAnswers);
      return NextResponse.json({ error: "Invalid quiz answers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      console.error("❌ Invalid selfie URL:", selfieUrl);
      return NextResponse.json({ error: "Invalid selfie URL" }, { status: 400 });
    }

    // STEP 1: Generate fantasy image
    let fantasyImage: string | null = null;
    try {
      fantasyImage = await generateFantasyImage(quizAnswers);
      console.log("🧠 SDXL fantasy image:", fantasyImage);
    } catch (err) {
      console.error("❌ Error generating fantasy image:", err);
      return NextResponse.json({ error: "Fantasy image generation failed", details: err }, { status: 500 });
    }

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image returned null" }, { status: 500 });
    }

    // STEP 2: Merge with FaceFusion
    let mergedImage: string | null = null;
    try {
      console.log("📤 Merging with FaceFusion:", { selfieUrl, fantasyImage });
      mergedImage = await mergeFaceWithScene(selfieUrl, fantasyImage);
      console.log("🌀 Merged image:", mergedImage);
    } catch (err) {
      console.error("❌ Error merging face into fantasy scene:", err);
      return NextResponse.json({ error: "FaceFusion failed", details: err }, { status: 500 });
    }

    if (!mergedImage) {
      return NextResponse.json({
        error: "Merged image is null",
        selfieUrl,
        fantasyImage,
        message: "Check if image URLs are valid"
      }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });

  } catch (err) {
    console.error("❌ Unexpected server error:", err);
    return NextResponse.json({ error: "Unhandled error in /api/generate", details: err }, { status: 500 });
  }
}
