// utils/facefusion.ts

import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function runFaceFusion(selfieUrl: string, fantasyImageUrl: string): Promise<string> {
  console.log("🧬 Starting FaceFusion...");
  console.log("🧬 FaceFusion payload:", {
    template_image: fantasyImageUrl,
    user_image: selfieUrl,
  });

  const response = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    {
      input: {
        template_image: fantasyImageUrl, // fantasy background
        user_image: selfieUrl,           // selfie face
        face_swap: true,
        similarity_threshold: 0.5,
        use_current_crop: true,
      },
    }
  );

  console.log("🧬 FaceFusion result:", response);

  if (!response || !Array.isArray(response) || !response[0]) {
    throw new Error("FaceFusion failed to generate output");
  }

  return response[0];
}
