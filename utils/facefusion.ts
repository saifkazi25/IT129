import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function mergeFaceWithFantasy(selfieUrl: string, fantasyImageUrl: string): Promise<string | null> {
  console.log("🧠 FaceFusion started");
  console.log("📸 Selfie URL:", selfieUrl);
  console.log("🎨 Fantasy Image URL:", fantasyImageUrl);

  try {
    const output = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          source_image: selfieUrl,
          target_image: fantasyImageUrl,
          face_enhancer: true,
          similarity: 0.7,
        },
      }
    );

    console.log("🧬 FaceFusion output:", output);

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }

    return null;
  } catch (error: any) {
    console.error("❌ FaceFusion failed:", error?.message || error);
    throw new Error("Face merging failed");
  }
}
