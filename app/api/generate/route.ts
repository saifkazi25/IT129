import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { mergeFaces } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    console.log("🚀 /api/generate called");

    const bodyText = await req.text();
    const { quizAnswers, selfieUrl } = JSON.parse(bodyText);

    if (!quizAnswers || !selfieUrl) {
      console.error("❌ Missing input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing quiz answers or selfie" }, { status: 400 });
    }

    console.log("📥 Received quizAnswers:", quizAnswers);
    console.log("📸 Received selfieUrl:", selfieUrl);

    const prompt = `A highly detailed fantasy scene featuring a person in a vivid, surreal setting inspired by: ${quizAnswers.join(", ")}. The person should be standing clearly in the center, facing forward, fantasy-themed outfit, high resolution.`;

    console.log("🎨 SDXL Prompt:", prompt);
    const sdxlImage = await generateFantasyImage(prompt);

    if (!sdxlImage) {
      console.error("❌ SDXL generation failed");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    console.log("🖼️ SDXL fantasy image result:", sdxlImage);

    const fantasyUrl = await uploadImageToCloudinary(sdxlImage);
    console.log("☁️ Cloudinary uploaded fantasy image URL:", fantasyUrl);

    const mergedImageUrl = await mergeFaces(selfieUrl, fantasyUrl);
    console.log("🧠 FaceFusion merged image URL:", mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

