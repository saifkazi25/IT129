import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs"; // required for external fetch

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const replicateBase = "https://api.replicate.com/v1/predictions";
const replicateHeaders = {
  Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
  "Content-Type": "application/json",
};

async function runReplicatePrediction(version: string, input: any) {
  const response = await fetch(replicateBase, {
    method: "POST",
    headers: {
      ...replicateHeaders,
      Prefer: "wait",
    },
    body: JSON.stringify({ version, input }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Replicate error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  return data.output;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers, image } = body;

    if (!answers || !image) {
      return NextResponse.json(
        { error: "Missing answers or selfie image." },
        { status: 400 }
      );
    }

    // Step 1: Format prompt
    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 2: Generate fantasy image via SDXL
    const sdxlResult = await runReplicatePrediction(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        prompt,
        width: 768,
        height: 768,
      }
    );

    const fantasyImage = sdxlResult?.[0];
    console.log("🎨 Fantasy Image:", fantasyImage);

    // Step 3: Upload selfie to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "tsukuyomi",
    });

    const selfieUrl = uploadRes.secure_url;
    console.log("📷 Selfie uploaded to:", selfieUrl);

    // Step 4: Run FaceFusion
    const fusionResult = await runReplicatePrediction(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        user_image: selfieUrl,
        template_image: fantasyImage,
      }
    );

    const result = fusionResult?.[0];

    return NextResponse.json({
      fantasyImage,
      result,
      faceMerged: true,
    });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

