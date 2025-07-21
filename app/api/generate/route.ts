import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceWithFantasyImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Received request body:", body);

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid quiz answers");
      return NextResponse.json({ error: "Invalid or missing quiz answers." }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      console.error("❌ Missing selfie URL");
      return NextResponse.json({ error: "Missing selfie URL." }, { status: 400 });
    }

    // STEP 1: Build prompt for SDXL
    const prompt = `A majestic, cinematic fantasy world inspired by ${quizAnswers[4]}.
A stylish ${quizAnswers[2]} wearing a ${quizAnswers[3]}, standing heroically in a mystical setting.
The scene includes hints of ${quizAnswers[0]}, with a ${quizAnswers[1]} atmosphere.
Character is looking directly at the viewer, symmetrical, front-facing, full face visible.
Highly detailed, realistic, sharp, digital art, trending on ArtStation.`;

    const negative_prompt = "blurry, distorted, low-res, cropped face, side profile, obscured face, shadows over face, multiple faces, out of frame";

    console.log("🪄 Sending prompt to SDXL:", prompt);

    // STEP 2: Generate fantasy image with SDXL
    const fantasyImageUrl = await generateFantasyImage({ prompt, negative_prompt });

    if (!fantasyImageUrl || typeof fantasyImageUrl !== "string") {
      throw new Error("SDXL failed to return a valid image URL.");
    }

    console.log("🌌 Fantasy image generated:", fantasyImageUrl);

    // STEP 3: Merge user's face onto fantasy image
    const mergedImageUrl = await mergeFaceWithFantasyImage({
      templateImage: fantasyImageUrl,
      userImage: selfieUrl,
    });

    if (!mergedImageUrl || typeof mergedImageUrl !== "string") {
      throw new Error("FaceFusion failed to return a merged image URL.");
    }

    console.log("🧬 Final merged image:", mergedImageUrl);

    return NextResponse.json({ imageUrl: mergedImageUrl });
  } catch (error: any) {
    console.error("🔥 Unexpected error in /api/generate:", error);
    return NextResponse.json({ error: "Unexpected error in image generation" }, { status: 500 });
  }
}
