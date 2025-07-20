import { NextResponse } from "next/server";
import { generateFantasyImage } from "../../../utils/replicate";
import { mergeFaceWithFantasyImage } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing input data" },
        { status: 400 }
      );
    }

    console.log("✅ Incoming quizAnswers:", quizAnswers);
    console.log("🧠 Incoming selfieUrl:", selfieUrl);

    const fantasyPrompt = `
      ultra-realistic digital art, epic cinematic lighting, a mystical scene showing ${
        quizAnswers[0]
      } in ${quizAnswers[1]}, a powerful ${quizAnswers[2]} wearing a ${quizAnswers[3]},
      in front of a ${quizAnswers[4]}, aura of ${quizAnswers[5]}, surrounded by ${quizAnswers[6]},
      portrait style, symmetrical, centered, clear view of face, fantasy setting
    `.replace(/\s+/g, " ");

    const negativePrompt =
      "blurry, low-resolution, distorted face, cropped face, face not visible, back of head, far away, chaotic background";

    const fantasyImageUrl = await generateFantasyImage({
      prompt: fantasyPrompt,
      negative_prompt: negativePrompt,
    });

    console.log("🖼️ SDXL fantasy image:", fantasyImageUrl);
    console.log("🤖 Merging with selfie:", selfieUrl);

    let finalImageUrl: string;

    try {
      finalImageUrl = await mergeFaceWithFantasyImage({
        templateImage: fantasyImageUrl,
        userImage: selfieUrl,
      });

      console.log("✅ Merged fantasy + selfie image:", finalImageUrl);
    } catch (mergeErr) {
      console.warn("⚠️ FaceFusion failed, fallback to fantasy image:", mergeErr);
      finalImageUrl = fantasyImageUrl;
    }

    return NextResponse.json({ imageUrl: finalImageUrl });
  } catch (err) {
    console.error("🔥 /api/generate failed:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
