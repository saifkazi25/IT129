import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

async function uploadToImgur(base64Image: string): Promise<string> {
  const res = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: base64Image.split(",")[1],
      type: "base64",
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error("Imgur upload failed: " + error);
  }

  const json = await res.json();
  return json.data.link;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body.answers;
    const base64Image = body.image;

    if (!answers || !base64Image) {
      return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
    }

    const prompt = `Create a fantasy scene with elements: ${answers.join(
      ", "
    )}. Include a clear, front-facing, photorealistic human character in the center of the scene.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // Generate fantasy image
    const sdxlOutput = await runPrediction(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        prompt,
        width: 768,
        height: 768,
      }
    );

    const fantasyImage = sdxlOutput[0];
    console.log("🔍 SDXL output:", fantasyImage);

    // Upload selfie to Imgur
    const userImageUrl = await uploadToImgur(base64Image);
    console.log("📷 Imgur selfie URL:", userImageUrl);

    // Merge face
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
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
