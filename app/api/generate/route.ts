import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// Configure Cloudinary
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
      return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
    }

    // 🧠 Build the prompt for SDXL
    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // 🖼️ Step 1: Generate fantasy image from SDXL
    const sdxlOutput = await runPrediction(
      "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      {
        prompt,
        width: 1024,
        height: 1024,
      }
    );

    const fantasyImage = sdxlOutput[0];
    console.log("🔍 SDXL output:", fantasyImage);

    // ☁️ Step 2: Upload selfie to Cloudinary to get a public URL
    const uploadResult = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image.split(",")[1]}`);
    const userImageUrl = uploadResult.secure_url;

    console.log("📷 Selfie uploaded to Cloudinary:", userImageUrl);

    // 🧬 Step 3: FaceFusion
    const fusionOutput = await runPrediction(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        user_image: userImageUrl,
        template_image: fantasyImage,
      }
    );

    const result = fusionOutput?.[0];

    return NextResponse.json({
      fantasyImage,
      result,
    });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
