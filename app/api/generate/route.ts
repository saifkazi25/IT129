import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // for faster execution

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { selfie, description } = body;

  if (!selfie || !description) {
    return NextResponse.json({ error: 'Missing input' }, { status: 400 });
  }

  const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'lucataco/modelscope-facefusion', // change if you're using another model
      input: {
        target_image: selfie,
        prompt: description,
      },
    }),
  });

  const data = await replicateResponse.json();

  if (replicateResponse.status !== 201) {
    return NextResponse.json({ error: data.detail || 'Error generating image' }, { status: 500 });
  }

  // Poll the status URL until complete
  let prediction = data;
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(prediction.urls.get, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
    });
    prediction = await res.json();
  }

  if (prediction.status === 'succeeded') {
    return NextResponse.json({ image: prediction.output });
  } else {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
