import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selfie, answers } = body;

    const prompt = `A realistic fantasy image of a ${answers.q2} wearing a ${answers.q3}, set in a ${answers.q4}, feeling ${answers.q5}, with the theme of ${answers.q0} and location ${answers.q1}, with element of ${answers.q6}.`;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a9758cb3...your-sdxl-model-version",
        input: {
          prompt: prompt,
          image: selfie,
        },
      }),
    });

    const json = await response.json();

    if (json?.error) {
      console.error("Replicate API error:", json.error);
      return NextResponse.json({ error: json.error }, { status: 500 });
    }

    return NextResponse.json({ output: json });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
