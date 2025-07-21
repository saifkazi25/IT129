import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceWithFantasyImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Received request body:", body);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length < 7) {
      return NextResponse.json({ error: "Invalid or missing quiz answers." }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      return NextResponse.json({ error: "Missing or invalid selfie URL." }, { status: 400 });
    }

    let fantasyImageUrl: string | null = null;
    let sdxlError: string | null = null;

    // Retry logic for SDXL (up to 3 times)
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🪄 Attempt ${attempt}: generating fantasy image...`);
        fantasyImageUrl = await generateFantasyImage({ quizAnswers });
        if (fantasyImageUrl) break;
      } catch (err: any) {
        sdxlError = err.message || "Unknown error from SDXL";
        console.warn(`⚠️ SDXL attempt ${attempt} failed:`, sdxlError);

        if (attempt < 3) {
          console.log("🔁 Retrying SDXL...");
          await new Promise((res) => setTimeout(res, 1000 * attempt));
        }
      }
    }

    if (!fantasyImageUrl) {
      console.error("🛑 Failed to generate fantasy image after retries.");
      return NextResponse.json({ error: sdxlError || "Fantasy image generation failed." }, { status: 500 });
    }

    // Try merging with FaceFusion
    try {
      console.log("🧬 Attempting face merge...");
      const mergedImageUrl = await mergeFaceWithFantasyImage({
        templateImage: fantasyImageUrl,
        userImage: selfieUrl,
      });

      if (mergedImageUrl) {
        console.log("✅ FaceFusion successful.");
        return NextResponse.json({ imageUrl: mergedImageUrl });
      }
    } catch (facefusionErr: any) {
      console.warn("⚠️ FaceFusion failed:", facefusionErr.message || facefusionErr);
    }

    // Fallback to fantasy image if FaceFusion fails
    console.log("↩️ Returning fantasy image without face merge.");
    return NextResponse.json({ imageUrl: fantasyImageUrl });
  } catch (err: any) {
    console.error("🔥 Unexpected error in /api/generate:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
