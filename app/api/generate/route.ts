// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { q0, q1, q2, q3, q4, q5, q6, image } = body;

  if (!image || !q0 || !q1 || !q2 || !q3 || !q4 || !q5 || !q6) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const prompt = `Fantasy World with mood: ${q0}, setting: ${q1}, character: ${q2}, outfit: ${q3}, background: ${q4}, theme: ${q5}, power: ${q6}.`;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "REPLACE_WITH_MODEL_VERSION", // Replace this!
      input: {
        prompt: prompt,
        image: image,
      },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }

  const prediction = await response.json();

  return NextResponse.json({ image: prediction.output });
}

