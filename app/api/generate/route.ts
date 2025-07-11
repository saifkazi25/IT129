import { NextResponse } from "next/server";

export const runtime = "nodejs"; // needed for fetch to external URLs

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

    // Build the fantasy prompt
    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: Generate image using SDXL
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

    // Step 2: Upload base64 selfie to Replicate (needs to be a public URL)
    const selfieUpload = await fetch("https://upload.replicate.delivery/v1/uploads", {
      method: "POST",
      headers: replicateHeaders,
    });
    const { upload_url: uploadUrl, serve_url: userImageUrl } = await selfieUpload.json();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: Buffer.from(base64Image.split(",")[1], "base64"),
    });

    // Step 3: Run FaceFusion
    const resultOutput = await runPrediction(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        user_image: userImageUrl,
        template_image: fantasyImage,
      }
    );

    const result = resultOutput?.[0];

    return NextResponse.json({ result, fantasyImage });
  } catch (err: any) {
    console.error("❌ API error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

