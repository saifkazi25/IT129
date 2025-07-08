import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answers, image } = await req.json();

  if (!answers || !image) {
    return NextResponse.json({ error: "Missing answers or image" }, { status: 400 });
  }

  try {
    const prompt = `A fantasy portrait of the user based on: ${answers.join(", ")}`;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a9758cbf0c39e88c8e5668b690520b8e3a21186a49b7410c2b6caa53b1d1e168", // SDXL version
        input: {
          prompt,
          image,
        },
      }),
    });

    const prediction = await response.json();
    const imageUrl = prediction?.urls?.get;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
  }
}
