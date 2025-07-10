import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

async function runWithRetry<T>(fn: () => Promise<T>, retries = 5): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const error = err as any;
      if (
        error?.response?.status === 429 &&
        error?.response?.headers?.get("retry-after")
      ) {
        const retryAfter = parseInt(
          error.response.headers.get("retry-after") || "3"
        );
        console.warn(`⚠️ Rate limited. Retrying in ${retryAfter}s...`);
        await new Promise((res) => setTimeout(res, retryAfter * 1000));
      } else {
        console.error("❌ Final error:", error);
        throw error;
      }
    }
  }
  throw new Error("Too many retries.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: Generate fantasy image using SDXL
    const sdxlRawResult = (await runWithRetry(() =>
      replicate.run(
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        {
          input: {
            prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
          },
        }
      )
    )) as string[];

    const fantasyImage = sdxlRawResult[0];
    console.log("🔍 Raw SDXL result:", sdxlRawResult);

    // DO NOT call FaceFusion yet — we return SDXL image only
    return NextResponse.json({
      fantasyImage,
      faceMerged: false,
    });
  } catch (error) {
    console.error("❌ Unexpected failure in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate fantasy image." },
      { status: 500 }
    );
  }
}
