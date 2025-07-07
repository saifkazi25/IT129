import type { NextApiRequest, NextApiResponse } from "next";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { selfieImage, quizAnswers } = req.body;

  if (!selfieImage || !quizAnswers) {
    return res.status(400).json({ error: "Missing inputs" });
  }

  try {
    // Step 1: Generate fantasy image using SDXL
    const prompt = `A cinematic fantasy scene inspired by: ${quizAnswers.join(", ")}`;

    const sdxlResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "a9758cbf40cf4df5a4c927a37252fe9d9eebcf6a0d15e0e7c3d5ef152af078f0", // SDXL
        input: {
          prompt,
          width: 512,
          height: 768,
        },
      }),
    });

    const sdxlData = await sdxlResponse.json();
    const sdxlUrl = sdxlData?.urls?.get;

    // Poll for SDXL output
    let generatedImageUrl = "";
    while (!generatedImageUrl) {
      const poll = await fetch(sdxlUrl, {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
      });
      const pollJson = await poll.json();
      if (pollJson.status === "succeeded") {
        generatedImageUrl = pollJson.output[0];
      } else if (pollJson.status === "failed") {
        throw new Error("Image generation failed.");
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Step 2: Merge with selfie using FaceFusion
    const faceFusionRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "c9328264a8144e7184bbd3e2583a00246dd02bcb0a90e761b3788d04f3fa8eb4", // FaceFusion
        input: {
          source_image: selfieImage,
          target_image: generatedImageUrl,
        },
      }),
    });

    const fusionData = await faceFusionRes.json();
    const fusionGetUrl = fusionData?.urls?.get;

    let finalImageUrl = "";
    while (!finalImageUrl) {
      const poll = await fetch(fusionGetUrl, {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` },
      });
      const pollJson = await poll.json();
      if (pollJson.status === "succeeded") {
        finalImageUrl = pollJson.output;
      } else if (pollJson.status === "failed") {
        throw new Error("Face fusion failed.");
      }
      await new Promise((r) => setTimeout(r, 2000));
    }

    return res.status(200).json({ image: finalImageUrl });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong", details: err.message });
  }
}
