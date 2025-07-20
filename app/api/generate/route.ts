import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeSelfieWithImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !selfieUrl) {
      console.error("❌ Missing input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    console.log("✅ Incoming quizAnswers:", quizAnswers);
    console.log("✅ Incoming selfieUrl:", selfieUrl);

    // Step 1: Generate fantasy image using SDXL
    const fantasyImageUrl = await generateFantasyImage(quizAnswers);

    if (!fantasyImageUrl) {
      console.error("❌ SDXL generation failed");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    console.log("🧙 Fantasy image URL:", fantasyImageUrl);

    // Step 2: Merge face with fantasy image using FaceFusion
    const mergedImageUrl = await mergeSelfieWithImage(selfieUrl, fantasyImageUrl);

    if (!mergedImageUrl) {
      console.error("❌ FaceFusion failed");
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    console.log("🧞 Final merged image:", mergedImageUrl);

    // Step 3: Return the final image URL
    return NextResponse.json({ outputUrl: mergedImageUrl });
  } catch (err: any) {
    console.error("❌ Unexpected error in /api/generate:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
