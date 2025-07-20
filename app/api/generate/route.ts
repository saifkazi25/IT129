import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceWithFantasyImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing quiz answers or selfie URL" },
        { status: 400 }
      );
    }

    console.log("🧠 Generating fantasy image with quiz answers:", quizAnswers);

    const templateImageUrl = await generateFantasyImage(quizAnswers);
    console.log("🎨 Fantasy image result:", templateImageUrl);

    console.log("🤖 Merging with selfie:", selfieUrl);

    const finalImageUrl = await mergeFaceWithFantasyImage({
      templateImage: templateImageUrl, // ✅ renamed key
      userImage: selfieUrl,            // ✅ renamed key
    });

    console.log("🧬 Final merged image URL:", finalImageUrl);

    return NextResponse.json({ imageUrl: finalImageUrl });
  } catch (error: any) {
    console.error("❌ Internal Server Error in /api/generate:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
