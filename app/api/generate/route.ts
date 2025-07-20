import { NextRequest, NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceWithScene } from "../../../utils/facefusion";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !Array.isArray(quizAnswers) || !selfieUrl) {
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    console.log("✅ Received quizAnswers:", quizAnswers);
    console.log("✅ Received selfieUrl:", selfieUrl);

    const fantasyImage = await generateFantasyImage(quizAnswers);
    console.log("🧠 Fantasy Image URL:", fantasyImage);

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    const mergedImage = await mergeFaceWithScene(selfieUrl, fantasyImage);
    console.log("🌀 Merged Image URL:", mergedImage);

    if (!mergedImage) {
      return NextResponse.json({
        error: "Face merging failed",
        debug: { selfieUrl, fantasyImage },
      }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });
  } catch (err) {
    console.error("❌ Error in /api/generate:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
