import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaces } from "../../../utils/facefusion";
import { uploadToCloudinary } from "../../../utils/cloudinary";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !selfieUrl) {
      console.error("❌ Missing input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    console.log("✅ Received quizAnswers:", quizAnswers);
    console.log("✅ Received selfieUrl:", selfieUrl);

    // Step 1: Generate fantasy image from SDXL
    const fantasyImageBase64 = await generateFantasyImage(quizAnswers);

    // Step 2: Upload fantasy image to Cloudinary
    const fantasyCloudinaryUrl = await uploadToCloudinary(fantasyImageBase64);
    console.log("🌠 Fantasy Cloudinary URL:", fantasyCloudinaryUrl);

    // Step 3: Call FaceFusion to merge the user's face into the fantasy image
    const mergedImageUrl = await mergeFaces({
      targetImageUrl: fantasyCloudinaryUrl,
      sourceImageUrl: selfieUrl,
    });

    console.log("🧠 Merged Image URL:", mergedImageUrl);

    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error("🔥 Error generating fantasy image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
