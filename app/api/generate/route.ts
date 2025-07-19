import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { generateFantasyImage, mergeFace } from "../../../utils/replicate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Incoming data:", { quizAnswers, selfieUrl });

    // Validation
    if (
      !Array.isArray(quizAnswers) ||
      quizAnswers.length !== 7 ||
      typeof selfieUrl !== "string" ||
      !selfieUrl.startsWith("http")
    ) {
      console.error("❌ Invalid input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing quiz or selfie" }, { status: 400 });
    }

    // 1. Generate fantasy image from quiz
    const fantasyPrompt = `A front-facing, ultra detailed cinematic fantasy scene with a ${quizAnswers[2]} in a ${quizAnswers[3]}, in a ${quizAnswers[4]} setting, inspired by ${quizAnswers[0]} vibes. Background: ${quizAnswers[1]}. Mood: ${quizAnswers[5]}, Element: ${quizAnswers[6]}.`;
    const fantasyImageUrl = await generateFantasyImage(fantasyPrompt);

    console.log("🎨 Fantasy Image URL:", fantasyImageUrl);

    // 2. Merge face using FaceFusion
    const mergedImageUrl = await mergeFace(selfieUrl, fantasyImageUrl);

    console.log("🧬 Final Merged Image URL:", mergedImageUrl);

    return NextResponse.json({ imageUrl: mergedImageUrl });
  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}


