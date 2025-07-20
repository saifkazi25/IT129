import { NextResponse } from "next/server";
import { generateFantasyImage, mergeFaceWithScene } from "../../../utils/replicate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    console.log("✅ Incoming data:", { quizAnswers, selfieUrl });

    if (!quizAnswers || !Array.isArray(quizAnswers) || quizAnswers.length !== 7) {
      console.error("❌ Invalid quizAnswers:", quizAnswers);
      return NextResponse.json({ error: "Invalid quiz answers" }, { status: 400 });
    }

    if (!selfieUrl || typeof selfieUrl !== "string" || !selfieUrl.startsWith("https://")) {
      console.error("❌ Invalid selfieUrl:", selfieUrl);
      return NextResponse.json({ error: "Invalid selfie URL" }, { status: 400 });
    }

    let fantasyImage: string | null = null;
    try {
      fantasyImage = await generateFantasyImage(quizAnswers);
      console.log("🧙 Fantasy image URL:", fantasyImage);
    } catch (err) {
      console.error("❌ Error generating fantasy image:", err);
      return NextResponse.json({ error: "Fantasy image generation failed" }, { status: 500 });
    }

    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image is null" }, { status: 500 });
    }

    let mergedImage: string | null = null;
    try {
      mergedImage = await mergeFaceWithScene(selfieUrl, fantasyImage);
      console.log("🤖 Merged image URL:", mergedImage);
    } catch (err) {
      console.error("❌ Error merging face with scene:", err);
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    if (!mergedImage) {
      return NextResponse.json({ error: "Merged image is null" }, { status: 500 });
    }

    return NextResponse.json({ outputUrl: mergedImage });
  } catch (error) {
    console.error("❌ Unexpected error in /api/generate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
