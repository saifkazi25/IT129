import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

async function runWithRetry<T>(fn: () => Promise<T>, retries = 5, delay = 4000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error?.response?.status === 429) {
      console.warn(`⚠️ Rate limited. Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
      return runWithRetry(fn, retries - 1, delay);
    } else {
      console.error("❌ Final error:", error);
      throw error;
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    if (!answers || !image) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const prompt = `Create a fantasy world with these elements: ${answers.join(", ")}.`;
    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: Generate fantasy image using SDXL
    const sdxlRawResult = await runWithRetry(() =>
      replicate.run(
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        {
          input: {
            prompt,
            width: 512,
            height: 512,
          },
        }
      )
    );

    const sdxlImages = Array.isArray(sdxlRawResult) ? sdxlRawResult : [];
    console.log("🔍 Raw SDXL result:", sdxlImages);

    const fantasyImage = sdxlImages[0];
    if (!fantasyImage) {
      throw new Error("Failed to generate fantasy image.");
    }

    // Step 2: Merge with selfie using FaceFusion
    console.log("🧪 SDXL image ready; pausing briefly before FaceFusion...");
    await new Promise((res) => setTimeout(res, 1000));

    const faceFusionResult = await runWithRetry(() =>
      replicate.run(
        "lucataco/modelscope-facefusion:5f0463764a78d257a602bfcd63fb3177f2fdf0774f4993b22f3e5383c6f127c1",
        {
          input: {
            source_image: image,
            target_image: fantasyImage,
          },
        }
      )
    );

    console.log("🖼️ Final Image:", faceFusionResult);

    return NextResponse.json({ output: faceFusionResult });
  } catch (e) {
    console.error("❌ Unexpected failure in API route:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


