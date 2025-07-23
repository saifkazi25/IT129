import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { mergeFaces } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    console.log("🚀 /api/generate called");

    const body = await req.text();
    const { quizAnswers, selfieUrl } = JSON.parse(body);

    console.log("📥 Received quizAnswers:", quizAnswers);
    console.log("📸 Received selfieUrl:", selfieUrl);

    // Input validation
    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid quizAnswers input");
      return NextResponse.json({ error: "Missing or invalid quizAnswers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      console.error("❌ Invalid selfieUrl input");
      return NextResponse.json({ error: "Missing or invalid selfieUrl" }, { status: 400 });
    }

    // Step 1: Create the SDXL prompt
    const prompt = `A highly detailed fantasy scene featuring a person in a vivid, surreal setting inspired by: ${quizAnswers.join(", ")}. The person should be standing clearly in the center, facing forward, fantasy-themed outfit, high resolution.`;
    console.log("🎨 SDXL Prompt:", prompt);

    // Step 2: Generate fantasy image using SDXL
    const fantasyImage = await generateFantasyImage(prompt);
    console.log("🖼️ SDXL fantasy image result:", fantasyImage);

    if (!fantasyImage) {
      console.error("❌ Fantasy image generation failed");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 400 });
    }

    // Step 3: Upload fantasy image to Cloudinary
    const fantasyImageUrl = await uploadImageToCloudinary(fantasyImage);
    console.log("☁️ Cloudinary uploaded fantasy image URL:", fantasyImageUrl);

    // Step 4: Merge user's face with fantasy image
    const mergedImageUrl = await mergeFaces(selfieUrl, fantasyImageUrl);
    console.log("🧠 Merged image URL (FaceFusion result):", mergedImageUrl);

    if (!mergedImageUrl) {
      console.error("❌ Face merging failed");
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    // Step 5: Return merged image URL to frontend
    console.log("✅ Returning merged image to frontend");
    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error("🔥 /api/generate unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
