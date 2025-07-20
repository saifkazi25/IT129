import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { generateFantasyImage, mergeFaceWithFantasy } from "../../../utils/replicate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      return NextResponse.json({ error: "Invalid quiz answers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string") {
      return NextResponse.json({ error: "Missing selfie URL" }, { status: 400 });
    }

    // Step 1: Generate fantasy image using SDXL
    const fantasyPrompt = `A detailed fantasy scene based on the following traits: 
      Theme: ${quizAnswers[0]},
      Location: ${quizAnswers[1]},
      Character: ${quizAnswers[2]},
      Outfit: ${quizAnswers[3]},
      Background: ${quizAnswers[4]},
      Mood: ${quizAnswers[5]},
      Power: ${quizAnswers[6]}. 
      Include a clearly visible front-facing human figure, cinematic lighting, highly detailed art`;

    const fantasyImageUrl = await generateFantasyImage(fantasyPrompt);
    if (!fantasyImageUrl) {
      return NextResponse.json({ error: "Failed to generate fantasy image" }, { status: 500 });
    }

    // Step 2: Merge selfie with fantasy image using FaceFusion
    const mergedImageUrl = await mergeFaceWithFantasy(selfieUrl, fantasyImageUrl);
    if (!mergedImageUrl) {
      return NextResponse.json({ error: "Face merge failed" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: mergedImageUrl }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
