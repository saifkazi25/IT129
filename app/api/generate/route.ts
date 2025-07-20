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
    console.log("🧠 Fantasy image result:", fantasyImage);

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    // Step 2: Merge face with fantasy image
    console.log("💡 Selfie URL:", selfieUrl);
    console.log("💡 Fantasy Image URL:", fantasyImage);

    const mergedImage = await mergeFaceWithScene(selfieUrl, fantasyImage);
    console.log("🌀 Merged fantasy + face result:", mergedImage);

    if (!mergedImage) {
      return NextResponse.json({ error: "Merged image is null" }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });
  } catch (error) {
    console.error("❌ Error in /api/generate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
