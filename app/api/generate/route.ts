import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceIntoFantasyImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("✅ Received request body:", body);

    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7 || !selfieUrl) {
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    // STEP 1: Generate fantasy image using SDXL (with retry)
    let fantasyImageUrl: string | null = null;
    let sdxlError: string | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🪄 Attempt ${attempt}: generating fantasy image...`);
        fantasyImageUrl = await generateFantasyImage(quizAnswers);
        if (fantasyImageUrl) break;
      } catch (err: any) {
        sdxlError = err.message || "Unknown error from SDXL";
        console.warn(`⚠️ SDXL attempt ${attempt} failed:`, sdxlError);

        if (attempt < 3) {
          console.log("🔁 Retrying SDXL...");
          await new Promise((res) => setTimeout(res, 1000 * attempt)); // exponential backoff
        }
      }
    }

    if (!fantasyImageUrl) {
      return NextResponse.json(
        { error: `Fantasy image generation failed: ${sdxlError}` },
        { status: 500 }
      );
    }

    // STEP 2: Merge user's face into fantasy image using FaceFusion
    let finalImageUrl: string;
    try {
      finalImageUrl = await mergeFaceIntoFantasyImage(selfieUrl, fantasyImageUrl);
    } catch (err: any) {
      console.error("🔥 FaceFusion failed:", err);
      return NextResponse.json(
        { error: "Face fusion failed. Please try again with a different selfie." },
        { status: 500 }
      );
    }

    // SUCCESS: Return final merged image
    return NextResponse.json({ imageUrl: finalImageUrl }, { status: 200 });

  } catch (err: any) {
    console.error("🔥 Unexpected error in /api/generate:", err);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again later." },
      { status: 500 }
    );
  }
}
