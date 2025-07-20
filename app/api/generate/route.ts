import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { faceSwapWithFusion } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !selfieUrl) {
      console.error("❌ Missing input data:", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    // Build prompt
    const prompt = `A front-facing portrait of a ${quizAnswers.join(", ")}, cinematic fantasy setting, detailed, symmetrical face, centered, high resolution`;

    console.log("🧠 Generating fantasy image with prompt:", prompt);
    const fantasyImage = await generateFantasyImage({ prompt });

    console.log("🎨 Fantasy image result:", fantasyImage);
    if (!fantasyImage) {
      console.error("❌ Fantasy image generation returned null");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    console.log("🤖 Merging with selfie:", selfieUrl);
    const mergedImage = await faceSwapWithFusion(selfieUrl, fantasyImage);

    console.log("🧑‍🚀 Merged image result:", mergedImage);
    if (!mergedImage) {
      console.error("❌ FaceFusion returned null");
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });
  } catch (err) {
    console.error("❌ Internal Server Error in /api/generate:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
