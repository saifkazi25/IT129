import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { faceSwapWithFusion } from "../../../utils/facefusion";

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
    console.log("🧠 Generating fantasy image...");
    const fantasyImage = await generateFantasyImage(quizAnswers);
    console.log("🎨 Fantasy image result:", fantasyImage);

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    // Step 2: Merge with FaceFusion
    console.log("🌀 Calling FaceFusion with:", { selfieUrl, fantasyImage });
    const mergedImage = await faceSwapWithFusion(selfieUrl, fantasyImage);
    console.log("🧬 FaceFusion output:", mergedImage);

    if (!mergedImage) {
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });
  } catch (error) {
    console.error("❌ Error in /api/generate route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
