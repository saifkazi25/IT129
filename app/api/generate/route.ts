import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { mergeFaces } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const { quizAnswers, selfieUrl } = JSON.parse(body);

    console.log("📥 Incoming quizAnswers:", quizAnswers);
    console.log("📥 Incoming selfieUrl:", selfieUrl);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid or missing quizAnswers");
      return NextResponse.json({ error: "Missing or invalid quizAnswers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      console.error("❌ Invalid or missing selfieUrl");
      return NextResponse.json({ error: "Missing or invalid selfieUrl" }, { status: 400 });
    }

    // Step 1: Convert quizAnswers to prompt
    const prompt = `A highly detailed fantasy scene featuring a person in a vivid, surreal setting inspired by: ${quizAnswers.join(", ")}. The person should be standing clearly in the center, facing forward, fantasy-themed outfit, high resolution.`;
    console.log("🎨 SDXL prompt:", prompt);

    // Step 2: Generate fantasy image from SDXL
    const fantasyImage = await generateFantasyImage(prompt);
    console.log("✨ SDXL fantasy image generated:", fantasyImage);

    if (!fantasyImage) {
      console.error("❌ Fantasy image generation failed");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 400 });
    }

    // Step 3: Upload fantasy image to Cloudinary
    const fantasyImageUrl = await uploadImageToCloudinary(fantasyImage, "fantasy");
    console.log("☁️ Uploaded fantasy image to Cloudinary:", fantasyImageUrl);

    // Step 4: Merge faces using FaceFusion
    const mergedImageUrl = await mergeFaces(selfieUrl, fantasyImageUrl);
    console.log("🧠 Face merged image URL:", mergedImageUrl);

    if (!mergedImageUrl) {
      console.error("❌ Face merging failed");
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    // Step 5: Return merged image URL
    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error("🔥 /api/generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
