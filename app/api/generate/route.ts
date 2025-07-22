import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceIntoImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !Array.isArray(quizAnswers) || !selfieUrl) {
      return NextResponse.json({ error: "Missing quizAnswers or selfieUrl" }, { status: 400 });
    }

    console.log("🎯 Generating fantasy image...");
    const fantasyImage = await generateFantasyImage(quizAnswers);

    console.log("🧠 Merging face with fantasy image...");
    const finalImageUrl = await mergeFaceIntoImage({
      targetImageUrl: fantasyImage,
      faceImageUrl: selfieUrl,
    });

    console.log("🌟 Final merged image URL:", finalImageUrl);

    if (!finalImageUrl) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    return NextResponse.json({ finalImageUrl });
  } catch (error: any) {
    console.error("🔥 Error in /api/generate:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error?.message || "Unexpected failure",
      },
      { status: 500 }
    );
  }
}

