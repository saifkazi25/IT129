import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { mergeFaces } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Incoming quizAnswers:", quizAnswers);
    console.log("✅ Incoming selfieUrl:", selfieUrl);

    if (
      !quizAnswers ||
      !Array.isArray(quizAnswers) ||
      quizAnswers.length !== 7 ||
      !selfieUrl ||
      typeof selfieUrl !== "string" ||
      !selfieUrl.startsWith("https://")
    ) {
      console.error("❌ Missing or invalid input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing or invalid input data" }, { status: 400 });
    }

    // Step 1: Create prompt
    const prompt = `An epic fantasy illustration featuring a ${quizAnswers[2]} in ${quizAnswers[1]} wearing a ${quizAnswers[3]}, surrounded by the theme of ${quizAnswers[4]}. The character is associated with the concept of ${quizAnswers[6]}. The style is vibrant, cinematic, highly detailed, front-facing, ultra-realistic face, award-winning concept art.`;

    console.log("🖼 Generating fantasy image with prompt:", prompt);

    // ✅ FIXED: pass as object
    const fantasyImageUrl = await generateFantasyImage({ prompt });
    console.log("✨ SDXL fantasy image generated:", fantasyImageUrl);

    // Step 3: Upload fantasy image to Cloudinary
    const uploadedFantasyUrl = await uploadToCloudinary(fantasyImageUrl);
    console.log("☁️ Fantasy image uploaded to Cloudinary:", uploadedFantasyUrl);

    // Step 4: Merge selfie with fantasy image
    const mergedImageUrl = await mergeFaces(selfieUrl, uploadedFantasyUrl);
    console.log("🧬 Final merged image URL:", mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (error) {
    console.error("💥 Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
