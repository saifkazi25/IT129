import { NextRequest, NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { mergeFaces } from "../../../utils/facefusion";

export async function POST(req: NextRequest) {
  console.log("🚀 /api/generate called");

  try {
    const body = await req.text();
    const json = JSON.parse(body);
    const quizAnswers = json.quizAnswers;
    const selfieUrl = json.selfieUrl;

    console.log("📥 Received quizAnswers:", quizAnswers);
    console.log("📸 Received selfieUrl:", selfieUrl);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid or missing quizAnswers");
      return NextResponse.json({ error: "Invalid or missing quizAnswers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      console.error("❌ Invalid or missing selfieUrl");
      return NextResponse.json({ error: "Invalid or missing selfieUrl" }, { status: 400 });
    }

    // Step 1: Generate fantasy image with SDXL
    const prompt = `A highly detailed fantasy scene featuring a person in a vivid, surreal setting inspired by: ${quizAnswers.join(", ")}. The person should be standing clearly in the center, facing forward, fantasy-themed outfit, high resolution.`;
    console.log("🎨 SDXL Prompt:", prompt);

    const fantasyImageUrl = await generateFantasyImage(prompt);
    console.log("🖼️ SDXL fantasy image result:", fantasyImageUrl);

    // Step 2: Upload SDXL image to Cloudinary
    console.log("⬆️ Uploading fantasy image to Cloudinary:", fantasyImageUrl);
    const cloudinaryFantasyUrl = await uploadImageToCloudinary(fantasyImageUrl);
    console.log("☁️ Cloudinary uploaded fantasy image URL:", cloudinaryFantasyUrl);

    // Step 3: Merge faces with FaceFusion
    const mergedImageUrl = await mergeFaces(selfieUrl, cloudinaryFantasyUrl);
    console.log("✅ Final merged image URL:", mergedImageUrl);

    // Success response
    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error("❌ Error in /api/generate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
