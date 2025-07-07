import { NextRequest, NextResponse } from "next/server";

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

async function runReplicatePrediction(body: unknown) {
  const res = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function pollPrediction(getUrl: string) {
  for (let i = 0; i < 60; i++) {
    const res = await fetch(getUrl, {
      headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
    });
    const json = await res.json();
    if (json.status === "succeeded") return json.output;
    if (json.status === "failed") throw new Error("Prediction failed");
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Prediction timeout");
}

export async function POST(req: NextRequest) {
  if (!REPLICATE_TOKEN) {
    return NextResponse.json(
      { error: "Missing REPLICATE_API_TOKEN" },
      { status: 500 },
    );
  }

  const { answers, selfie } = await req.json();

  const promptMap: Record<string, string> = {
    "sci-fi": "A futuristic astronaut exploring a vibrant alien galaxy, cinematic lighting",
    medieval: "A valiant knight standing before a majestic dragon and castle at dawn",
    cyberpunk: "A neon‑lit cyberpunk city street with towering holograms and rain‑soaked pavement",
  };

  const prompt = promptMap[answers?.q1 as string] || "fantasy illustration";

  // 1. Generate background template with SDXL
  const sdxlBody = {
    version: "610dddf0e54f1c08be3113dfacc52fecdac4c96db27fdf169cad22a74ab2e333",
    input: { prompt, width: 768, height: 768 },
  };

  const sdxlPrediction = await runReplicatePrediction(sdxlBody);
  const templateUrl = await pollPrediction(sdxlPrediction.urls.get);

  // 2. Fuse face with template using FaceFusion
  const faceFusionBody = {
    version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    input: {
      user_image: selfie,
      template_image: templateUrl,
      upscale: "RealESRGAN_x4plus",
    },
  };

  const facePrediction = await runReplicatePrediction(faceFusionBody);
  const outputUrl = await pollPrediction(facePrediction.urls.get);

  return NextResponse.json({ imageUrl: outputUrl });
}
