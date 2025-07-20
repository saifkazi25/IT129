import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

interface FaceFusionInput {
  templateImage: string;
  userImage: string;
}

export async function mergeFaceWithFantasyImage({
  templateImage,
  userImage,
}: FaceFusionInput): Promise<string> {
  const version =
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7";

  const input = {
    template_image: templateImage,
    user_image: userImage,
    face_swap: true,
    similarity_threshold: 0.4,
    use_current_crop: false, // fallback behavior to increase compatibility
  };

  console.log("🧬 FaceFusion input:", input);

  // Retry logic
  let output;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      output = await replicate.run(version, { input });

      if (Array.isArray(output) && output[0]) {
        console.log(`🧬 FaceFusion success on attempt ${attempt}:`, output[0]);
        return output[0] as string;
      } else {
        console.warn(`❌ Attempt ${attempt}: No output from FaceFusion.`);
      }
    } catch (err) {
      console.error(`🔥 FaceFusion error on attempt ${attempt}:`, err);
    }
  }

  throw new Error("FaceFusion failed after 3 attempts. Face not detected or incompatible image.");
}
