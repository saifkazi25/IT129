import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const { quizAnswers } = JSON.parse(body);

    console.log("🚀 /api/generate called");
    console.log("📥 Received quizAnswers:", quizAnswers);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      return NextResponse.json({ error: "Missing or invalid quizAnswers" }, { status: 400 });
    }

    const prompt = `A highly detailed fantasy scene featuring a person in a vivid, surreal setting inspired by: ${quizAnswers.join(", ")}. The person should be standing clearly in the center, facing forward, fantasy-themed outfit, high resolution.`;
    console.log("🎨 SDXL Prompt:", prompt);

    const fantasyImage = await generateFantasyImage(prompt);
    console.log("🖼️ SDXL fantasy image result:", fantasyImage);

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 400 });
    }

    const fantasyImageUrl = await uploadImageToCloudinary(fantasyImage);
    console.log("☁️ Cloudinary uploaded fantasy image URL:", fantasyImageUrl);

    return NextResponse.json({ fantasyImageUrl });
  } catch (error: any) {
    console.error("🔥 /api/generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
