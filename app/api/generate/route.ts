import { NextRequest, NextResponse } from "next/server";
import replicate from "../../../utils/replicate";
import { uploadToCloudinary } from "../../../utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { quizAnswers, selfieDataUrl } = await req.json();

    if (!quizAnswers || !selfieDataUrl) {
      return NextResponse.json(
        { error: "Missing quiz answers or selfie" },
        { status: 400 }
      );
    }

    // Upload selfie to Cloudinary and get public URL
    const uploadedSelfieUrl = await uploadToCloudinary(selfieDataUrl);

    // Prepare prompt
    const fantasyPrompt = `a fantasy scene featuring a ${quizAnswers[2]} wearing a ${quizAnswers[3]}, set in a ${quizAnswers[4]}, with a theme of ${quizAnswers[5]}, power of ${quizAnswers[6]}. Ultra-detailed, front-facing character, magical atmosphere`;

    // Step 1: Generate fantasy image using SDXL
    const fantasyOutput = await replicate.run(
      "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      {
        input: {
          prompt: fantasyPrompt,
          width: 768,
          height: 768,
        },
      }
    );

    const fantasyImageUrl = fantasyOutput[0];

    // Step 2: Merge face into fantasy image using FaceFusion
    const mergedOutput = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          target_image: fantasyImageUrl,
          source_image: uploadedSelfieUrl,
        },
      }
    );

    const finalImageUrl = mergedOutput[0];

    return NextResponse.json({ image: finalImageUrl });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while generating the image" },
      { status: 500 }
    );
  }
}
