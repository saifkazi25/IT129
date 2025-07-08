import Replicate from "replicate";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

// POST /api/generate ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    // 1️⃣ Parse the JSON body
    const { answers, image } = await req.json() as {
      answers: string[];
      image: string; // base64 selfie
    };

    if (!answers || answers.length !== 7 || !image)
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );

    // 2️⃣ Build your fantasy prompt (simple example)
    const prompt = `
      A highly detailed fantasy portrait, ${answers.join(", ")},
      ultra-realistic, 8k, cinematic lighting
    `;

    // 3️⃣ (Optional) First run face-fusion to swap the user’s face in
    const fusedFace = await replicate.run(
      "lucataco/modelscope-facefusion:9d15abdf9f93fc26807b1269d2d4c5e9",
      {
        input: {
          source_image: image,
          target_prompt: prompt,
        },
      }
    );

    // 4️⃣ Then generate the final scene with SDXL
    const generatedImage = await replicate.run(
      "stability-ai/sdxl:fe6f3feae3e6e728f250f1fb521a8e5d41e55972e2f4623a459b0bd2ab3f8b0e",
      {
        input: {
          prompt,
          refiner: true,
          image: typeof fusedFace === "string" ? fusedFace : undefined,
        },
      }
    );

    // 5️⃣ Return just the URL / base64; client stores it locally
    return NextResponse.json({ image: generatedImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Generation failed" },
      { status: 500 }
    );
  }
}

