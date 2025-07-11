import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const replicateBase = "https://api.replicate.com/v1/predictions";
const replicateHeaders = {
  Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
  "Content-Type": "application/json",
};

async function runPrediction(version: string, input: any) {
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
    const answers = body.answers;
    const base64Image = body.image;

    if (!answers || !base64Image) {
      return NextResponse.json({ error: "Missing answers or selfie image." }, { status: 400 });
    }

    // Build the SDXL fantasy prompt
    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: Generate fantasy image using SDXL
    const sdxlResult = await runPrediction(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        prompt,
        width: 768,
        height: 768,
      }
    );

    const fantasyImage = sdxlResult?.[0];
    console.log("🔍 SDXL output:", fantasyImage);

    // Step 2: Upload selfie to Cloudinary
    const cloudinaryUpload = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "infinite-tsukuyomi",
    });

    const userImageUrl = cloudinaryUpload.secure_url;
    console.log("📸 Cloudinary selfie uploaded:", userImageUrl);

    // Step 3: Merge using FaceFusion
    const resultOutput = await runPrediction(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        user_image: userImageUrl,
        template_image: fantasyImage,
      }
    );

    const mergedResult = resultOutput?.[0];
    console.log("🌌 Final merged result:", mergedResult);

    return NextResponse.json({ result: mergedResult, fantasyImage });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
