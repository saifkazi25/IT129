import { NextResponse } from "next/server";
import { generateFantasyImage, mergeFaceWithFantasy } from "../../../utils/replicate";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    console.log("✅ Incoming data:", { quizAnswers, selfieUrl });

    if (
      !quizAnswers ||
      !Array.isArray(quizAnswers) ||
      quizAnswers.length !== 7 ||
      !selfieUrl ||
      typeof selfieUrl !== "string"
    ) {
      console.error("❌ Invalid input data", { quizAnswers, selfieUrl });
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // 🔧 Join quiz answers into a single fantasy prompt
    const fantasyPrompt = quizAnswers.join(" ");

    // Step 1: Generate Fantasy Image using SDXL
    const fantasyImageUrl = await generateFantasyImage(fantasyPrompt);
    if (!fantasyImageUrl) {
      console.error("❌ Fantasy image generation failed");
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    // Step 2: Merge face using FaceFusion
    const mergedImageUrl = await mergeFaceWithFantasy(selfieUrl, fantasyImageUrl);
    if (!mergedImageUrl) {
      console.error("❌ Face fusion failed");
      return NextResponse.json({ error: "Face fusion failed" }, { status: 500 });
    }

    // Step 3: Return final image
    return NextResponse.json({ imageUrl: mergedImageUrl });
  } catch (error) {
    console.error("❌ Unexpected error in /api/generate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
