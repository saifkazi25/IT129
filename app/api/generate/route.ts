import { NextRequest, NextResponse } from "next/server";
import replicate from "../../../utils/replicate";
import { uploadToCloudinary } from "../../../utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !selfieUrl) {
      return NextResponse.json(
        { error: "Missing input data", quizAnswers, selfieUrl },
        { status: 400 }
      );
    }

    // Step 1: Generate fantasy image from quiz answers using SDXL
    const prompt = `A vivid fantasy scene with a ${quizAnswers[2]} wearing a ${quizAnswers[3]} in a ${quizAnswers[4]}. Style: ${quizAnswers[0]}, Mood: ${quizAnswers[5]}, Element: ${quizAnswers[6]}. Location: ${quizAnswers[1]}. Full-body, centered character, sharp focus, detailed background`;

    const sdxlResponse = await replicate.run(
      "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      {
        input: {
          prompt,
          width: 1024,
          height: 1024,
          guidance_scale: 7,
          num_inference_steps: 30
        }
      }
    );

    const fantasyImageUrl = sdxlResponse[0];
    if (!fantasyImageUrl) {
      return NextResponse.json({ error: "Failed to generate fantasy image" }, { status: 500 });
    }

    // Step 2: Merge user selfie into fantasy image using FaceFusion
    const facefusionResponse = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          source_image: selfieUrl,
          target_image: fantasyImageUrl,
          face_swap: true
        }
      }
    );

    const mergedImageUrl = facefusionResponse;
    if (!mergedImageUrl) {
      return NextResponse.json({ error: "Failed to merge face into fantasy image" }, { status: 500 });
    }

    return NextResponse.json({ mergedImageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

