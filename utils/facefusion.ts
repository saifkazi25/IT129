import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function runFaceFusion(sourceImageUrl: string, targetImageUrl: string): Promise<string> {
  try {
    const output = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      {
        input: {
          source_image: sourceImageUrl,
          target_image: targetImageUrl,
          face_enhancer: true,
          proportion: 1.0,
        },
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }

    throw new Error("No image returned from FaceFusion");
  } catch (error) {
    console.error("❌ Error in runFaceFusion:", error);
    throw error;
  }
}
