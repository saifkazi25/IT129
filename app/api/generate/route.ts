import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceWithFantasyImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      return NextResponse.json({ error: "Invalid or missing quiz answers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      return NextResponse.json({ error: "Missing selfie URL" }, { status: 400 });
    }

    // 1. Generate SDXL fantasy image
    const fantasyPrompt = `A fantasy scene based on these elements: ${quizAnswers.join(", ")}. 
    Include a clearly visible, centered, symmetrical human face with soft lighting, fantasy costume, cinematic details, full head and upper body.`;

    const negativePrompt = "blurry, distorted, cropped, dark, back of head, face hidden, bad anatomy, low resolution";

    const fantasyImageUrl = await generateFantasyImage({
      prompt: fantasyPrompt,
      negative_prompt: negativePrompt,
    });

    if (!fantasyImageUrl) {
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    // 2. Merge the user's selfie with the fantasy image
    const mergedImageUrl = await mergeFaceWithFantasyImage({
      templateImage: fantasyImageUrl,
      userImage: selfieUrl,
    });

    if (!mergedImageUrl) {
      return NextResponse.json({ error: "FaceFusion failed" }, { status: 500 });
    }

    // 3. Return the final merged image
    return NextResponse.json({ imageUrl: mergedImageUrl });
  } catch (err: any) {
    console.error("🔥 API error:", err);
    return NextResponse.json({ error: "Unexpected error in image generation" }, { status: 500 });
  }
}
