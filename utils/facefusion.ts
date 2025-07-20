import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function mergeFaceWithScene(selfieUrl: string, fantasyImageUrl: string): Promise<string | null> {
  const input = {
    source_image: selfieUrl,
    target_image: fantasyImageUrl,
    version: "v1.2",
    mode: "seamless",
  };

  try {
    const output = await replicate.run(
      "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
      { input }
    );

    console.log("🌀 FaceFusion output:", output);

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    } else {
      console.error("❌ FaceFusion returned no output");
      return null;
    }
  } catch (err) {
    console.error("❌ FaceFusion error:", err);
    return null;
  }
}
