import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { faceSwapWithFusion } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !selfieUrl) {
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    // ✅ Step 1: Build prompt to help FaceFusion work
    const prompt = `A front-facing portrait of a ${quizAnswers.join(", ")}, cinematic fantasy setting, detailed, symmetrical face, centered, high resolution`;

    console.log("🧠 Generating fantasy image with prompt:", prompt);
    const fantasyImage = await generateFantasyImage({ prompt });

    console.log("🎨 Fantasy image result:", fantasyImage);
    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    // ✅ Step 2: Merge user's face with fantasy image
    const mergedImage = await faceSwapWithFusion(selfieUrl, fantasyImage);

    console.log("🧑‍🚀 Merged final image:", mergedImage);
    if (!mergedImage) {
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });
  } catch (err) {
    console.error("❌ Error in /api/generate:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
