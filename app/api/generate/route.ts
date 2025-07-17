import { NextRequest, NextResponse } from "next/server";
import replicate from "../../../utils/replicate";
import cloudinary from "../../../utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing quiz answers or selfie" },
        { status: 400 }
      );
    }

    console.log("🎯 Received quizAnswers:", quizAnswers);
    console.log("🖼️ Received selfieUrl:", selfieUrl);

    // 1. Generate fantasy image with SDXL
    const fantasyPrompt = `A highly detailed fantasy scene featuring a ${
      quizAnswers[2]
    } in ${quizAnswers[1]}, wearing a ${quizAnswers[3]}, near a ${quizAnswers[4]}. Vibe: ${quizAnswers[5]}. Powers: ${quizAnswers[6]}. Front-facing, fantasy, cinematic lighting.`;

    const sdxlOutput = await replicate.run(
      "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      {
        input: {
          prompt: fantasyPrompt,
          width: 768,
          height: 768,
        },
      }
    );

    const fantasyImageUrl = sdxlOutput?.[0];
    if (!fantasyImageUrl) {
      return NextResponse.json(
        { error: "Failed to generate fantasy image" },
        { status: 500 }
      );
    }

    console.log("🧙 Fantasy image generated:", fantasyImageUrl);

    // 2. Merge face with FaceFusion
    const faceFusionOutput = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          target_image: fantasyImageUrl,
          source_image: selfieUrl,
          face_enhancer: true,
        },
      }
    );

    const mergedImageUrl = faceFusionOutput?.[0];
    if (!mergedImageUrl) {
      return NextResponse.json(
        { error: "Failed to merge face into fantasy image" },
        { status: 500 }
      );
    }

    console.log("🧬 Final merged image:", mergedImageUrl);

    return NextResponse.json({ imageUrl: mergedImageUrl });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { error: "Server error generating image" },
      { status: 500 }
    );
  }
}
