import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// Helper: Upload base64 image to Replicate delivery host
async function uploadImage(base64: string): Promise<string> {
  const blob = await fetch(base64).then(res => res.blob());
  const form = new FormData();
  form.append("file", blob, "selfie.png");

  const response = await fetch("https://upload.replicate.delivery/v1/upload", {
    method: "POST",
    body: form,
  });

  const data = await response.json();
  return data?.url;
}

// Retry wrapper for rate limits
async function runWithRetry<T>(fn: () => Promise<T>, retries = 5): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const retryAfter = parseInt(
        err?.response?.headers?.get("retry-after") || "3"
      );
      console.warn(`⚠️ Rate limited. Retrying in ${retryAfter}s...`);
      await new Promise((res) => setTimeout(res, retryAfter * 1000));
    }
  }
  throw new Error("Too many retries.");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    const prompt = `Create a fantasy scene with elements: ${answers.join(", ")}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;
    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: SDXL Fantasy Generation
    const sdxlRawResult = (await runWithRetry(() =>
      replicate.run("stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", {
        input: {
          prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
        },
      })
    )) as string[];

    const fantasyImage = sdxlRawResult[0];
    console.log("🔍 SDXL output:", fantasyImage);

    // Step 2: Upload selfie to replicate.delivery
    const selfieUrl = await uploadImage(image);
    console.log("📤 Uploaded selfie URL:", selfieUrl);

    // Step 3: Merge via FaceFusion
    const faceFusionResult = await runWithRetry(() =>
      replicate.run("lucataco/modelscope-facefusion:2b86f64b07fc066509300001cf7e060d45a19e538d6aa30a02a4f17445e17df5", {
        input: {
          user_image: selfieUrl,
          template_image: fantasyImage,
        },
      })
    );

    console.log("✅ FaceFusion complete:", faceFusionResult);

    return NextResponse.json({
      result: faceFusionResult,
      fantasyImage,
      faceMerged: true,
    });
  } catch (error) {
    console.error("❌ Backend API failed:", error);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
