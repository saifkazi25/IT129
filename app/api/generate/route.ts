import { NextRequest, NextResponse } from "next/server";
import replicate from "../../../utils/replicate";
import uploadToCloudinary from "../../../utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const { quizAnswers, selfieUrl } = await req.json();

    if (!quizAnswers || !Array.isArray(quizAnswers) || !selfieUrl) {
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    // Step 1: Generate fantasy image using SDXL (latest version)
    const fantasyPrompt = `high-resolution concept art of a ${
      quizAnswers[2]
    } wearing ${quizAnswers[3]}, in a ${quizAnswers[4]} setting, theme: ${
      quizAnswers[5]
    }, powers: ${quizAnswers[6]}. Cinematic style, colorful fantasy world, sharp focus, full body, front-facing, eyes visible`;

    const sdxlOutput = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          prompt: fantasyPrompt,
          width: 768,
          height: 768,
          refine: "expert_ensemble_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.8,
          num_inference_steps: 25
        }
      }
    );

    const fantasyImage = sdxlOutput?.[0];
    if (!fantasyImage) {
      return NextResponse.json({ error: "Failed to generate fantasy image." }, { status: 500 });
    }

    // Step 2: Merge face with fantasy image using FaceFusion (latest version)
    const faceFusionOutput = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          user_image: selfieUrl,
          template_image: fantasyImage
        }
      }
    );

    const finalImage = faceFusionOutput?.[0];
    if (!finalImage) {
      return NextResponse.json({ error: "Face fusion failed." }, { status: 500 });
    }

    return NextResponse.json({ image: finalImage });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

