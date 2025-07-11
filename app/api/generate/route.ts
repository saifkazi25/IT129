import { NextResponse } from "next/server";
import Replicate from "replicate";
import cloudinary from "cloudinary";

export const runtime = "nodejs"; // Required for fetch in edge environments

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(base64Image: string) {
  try {
    const res = await cloudinary.v2.uploader.upload(base64Image, {
      folder: "infinite-tsukuyomi",
    });
    return res.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary Upload Error:", err);
    throw new Error("Failed to upload selfie to Cloudinary");
  }
}

export async function POST(req: Request) {
  try {
    const { answers, image } = await req.json();

    if (!answers || !image) {
      return NextResponse.json(
        { error: "Missing answers or selfie image." },
        { status: 400 }
      );
    }

    // Prompt formatting
    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;
    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: Generate fantasy image using SDXL
    const sdxlRawResult = (await replicate.run(
      "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
      {
        input: {
          prompt,
          width: 1024,
          height: 1024,
        },
      }
    )) as string[];

    const fantasyImage = sdxlRawResult?.[0];
    console.log("🔍 SDXL output:", fantasyImage);

    // Step 2: Upload selfie to Cloudinary
    const userImageUrl = await uploadToCloudinary(image);
    console.log("📸 Cloudinary Selfie URL:", userImageUrl);

    // Step 3: Merge using FaceFusion
    const fusionResult = (await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          user_image: userImageUrl,
          template_image: fantasyImage,
        },
      }
    )) as string[];

    const result = fusionResult?.[0];
    console.log("🌀 FaceFusion Result:", result);

    return NextResponse.json({ fantasyImage, result });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
