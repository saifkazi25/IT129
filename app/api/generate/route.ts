import { NextRequest, NextResponse } from "next/server";
import replicate from "../../../utils/replicate";
import cloudinary from "../../../utils/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quizAnswers, selfieUrl } = body;

    if (!quizAnswers || !Array.isArray(quizAnswers) || !selfieUrl) {
      return NextResponse.json({ error: "Missing input data" }, { status: 400 });
    }

    const fantasyPrompt = `a highly detailed fantasy artwork of a ${quizAnswers[2]}, wearing a ${quizAnswers[3]}, in a ${quizAnswers[4]}, expressing ${quizAnswers[5]}, with a theme of ${quizAnswers[0]} in ${quizAnswers[1]}, cinematic lighting, front-facing view`;

    const output = await replicate.run(
      "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      {
        input: {
          prompt: fantasyPrompt,
          width: 1024,
          height: 1024,
          style_preset: "cinematic",
        },
      }
    );

    const mergedOutput = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          target_image: output[0],
          source_image: selfieUrl,
          face_enhancer: true,
        },
      }
    );

    return NextResponse.json({ image: mergedOutput });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
