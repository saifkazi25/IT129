import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function faceSwapWithFusion(
  selfieUrl: string,
  fantasyImageUrl: string
): Promise<string | null> {
  try {
    console.log("🔁 FaceFusion: Starting with selfie:", selfieUrl);
    console.log("🌌 Fantasy image:", fantasyImageUrl);

    const output = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          source_image: selfieUrl,
          target_image: fantasyImageUrl,
          face_enhancer: "gfpgan", // optional
        },
      }
    );

    console.log("✅ FaceFusion output:", output);

    if (Array.isArray(output)) {
      return output[0] as string;
    }

    return typeof output === "string" ? output : null;
  } catch (error) {
    console.error("❌ FaceFusion error:", error);
    return null;
  }
}
