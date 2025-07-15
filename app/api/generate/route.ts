// app/api/generate/route.ts

import { NextResponse } from "next/server";
import { uploadImageToCloudinary } from "../../../utils/cloudinary";
import { generateFantasyImage, mergeFaceWithFantasy } from "../../../utils/replicate";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quiz, selfie } = body;

    if (!quiz || !Array.isArray(quiz) || quiz.length < 7) {
      return NextResponse.json({ error: "Invalid quiz data." }, { status: 400 });
    }

    if (!selfie || typeof selfie !== "string") {
      return NextResponse.json({ error: "Selfie not provided." }, { status: 400 });
    }

    // Upload selfie to Cloudinary
    const cloudinaryUrl = await uploadImageToCloudinary(selfie);
    if (!cloudinaryUrl) {
      return NextResponse.json({ error: "Failed to upload selfie." }, { status: 500 });
    }

    // Generate fantasy image using SDXL with enhanced prompt
    const fantasyPrompt = `A highly detailed fantasy scene featuring a ${quiz[2]} wearing a ${quiz[3]} in a ${quiz[4]} setting, inspired by ${quiz[5]} and ${quiz[6]}. Beautiful lighting, ethereal atmosphere, cinematic. The character is standing clearly facing the camera.`;
    const fantasyImage = await generateFantasyImage(fantasyPrompt);
    if (!fantasyImage) {
      return NextResponse.json({ error: "Fantasy image generation failed." }, { status: 500 });
    }

    // Merge face using FaceFusion
    const finalImage = await mergeFaceWithFantasy(cloudinaryUrl, fantasyImage);
    if (!finalImage) {
      return NextResponse.json({ error: "Face merging failed." }, { status: 500 });
    }

    return NextResponse.json({ image: finalImage });
  } catch (err) {
    console.error("Error generating image:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

