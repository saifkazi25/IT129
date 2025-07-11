import { NextRequest, NextResponse } from "next/server";
import { uploadSelfieToCloudinary } from "@/utils/cloudinary";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

async function runWithRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      console.warn("Retrying due to error:", err);
      return runWithRetry(fn, retries - 1);
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const answers: string[] = body.answers;
    const selfieBase64: string = body.image;

    if (!answers || !selfieBase64) {
      return NextResponse.json(
        { error: "Missing answers or selfie image." },
        { status: 400 }
      );
    }

    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    // Step 1: SDXL Image Generation
    const sdxlResult = (await runWithRetry(() =>
      replicate.run(
        "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
        {
          input: {
            prompt,
            width: 1024,
            height: 1024,
          },
        }
      )
    )) as string[];

    const fantasyImage = sdxlResult[0];
    console.log("🔍 Raw SDXL result:", sdxlResult);

    // Step 2: Upload Selfie to Cloudinary to get public URL
    const selfieUrl = await uploadSelfieToCloudinary(selfieBase64);
    console.log("🌤️ Uploaded selfie URL:", selfieUrl);

    // Step 3: FaceFusion
    const fusionResult = (await runWithRetry(() =>
      replicate.run(
        "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
        {
          input: {
            target_image: fantasyImage,
            source_image: selfieUrl,
          },
        }
      )
    )) as string[];

    const finalImage = fusionResult[0];
    console.log("🧠 Final Image URL:", finalImage);

    return NextResponse.json({ url: finalImage });
  } catch (error: any) {
    console.error("❌ API error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}

