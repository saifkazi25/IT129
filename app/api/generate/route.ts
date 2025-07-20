import { NextResponse } from "next/server";
import generateFantasyImage from "../../../utils/replicate";
import faceSwapWithFusion from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !Array.isArray(quizAnswers) || !selfieUrl) {
      console.error("❌ Missing input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    console.log("✅ Incoming quizAnswers:", quizAnswers);
    console.log("✅ Incoming selfieUrl:", selfieUrl);

    // Step 1: Generate fantasy image using SDXL
    const fantasyImageUrl = await generateFantasyImage(quizAnswers);

    if (!fantasyImageUrl) {
      console.error("❌ Fantasy image generation failed");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    console.log("🎨 Fantasy image URL:", fantasyImageUrl);

    // Step 2: Merge selfie + fantasy using FaceFusion
    const mergedImageUrl = await faceSwapWithFusion(selfieUrl, fantasyImageUrl);

    if (!mergedImageUrl) {
      console.error("❌ Face merging failed");
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    console.log("🧞 Final merged image:", mergedImageUrl);
    return NextResponse.json({ image: mergedImageUrl }, { status: 200 });

  } catch (err) {
    console.error("❌ Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
