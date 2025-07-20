import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { runFaceFusion } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !Array.isArray(quizAnswers)) {
      return NextResponse.json({ error: "Missing or invalid quizAnswers" }, { status: 400 });
    }

    if (!selfieUrl) {
      return NextResponse.json({ error: "Missing selfieUrl" }, { status: 400 });
    }

    // Step 1: Generate prompt
    const fantasyPrompt = `A front-facing portrait of a ${quizAnswers.join(", ")}, cinematic fantasy setting, detailed, symmetrical face, centered, high resolution, highly detailed, symmetrical face, centered face, looking directly at camera, cinematic lighting, fantasy environment`;
    const negativePrompt =
      "blurry, low-res, deformed, poorly drawn face, asymmetrical, occluded face, cropped, out of frame";

    console.log("🧠 Generating fantasy image with prompt:", fantasyPrompt);

    // Step 2: Generate fantasy image using SDXL
    const fantasyImage = await generateFantasyImage({
      prompt: fantasyPrompt,
      negative_prompt: negativePrompt,
    });

    console.log("🎨 Fantasy image result:", fantasyImage);

    if (!fantasyImage) {
      return NextResponse.json({ error: "Failed to generate fantasy image" }, { status: 500 });
    }

    console.log("🤖 Merging with selfie:", selfieUrl);

    // Step 3: Merge face using FaceFusion
    const mergedImage = await runFaceFusion(selfieUrl, fantasyImage);

    console.log("🧬 Final merged image:", mergedImage);

    return NextResponse.json({ image: mergedImage });
  } catch (error: any) {
    console.error("❌ Internal Server Error in /api/generate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

