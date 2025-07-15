import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});

export async function generateFantasyImage(quizAnswers: string[]) {
  const prompt = `A majestic fantasy scene based on: ${quizAnswers.join(", ")}. A front-facing character, high detail, cinematic lighting.`;

  const output = await replicate.run(
    "stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b",
    {
      input: {
        prompt,
        width: 768,
        height: 768,
      },
    }
  );

  return output[0]; // URL of the SDXL-generated image
}

export async function mergeFaceIntoImage({
  sourceImage,
  targetFace,
}: {
  sourceImage: string;
  targetFace: string;
}) {
  const output = await replicate.run(
    "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
    {
      input: {
        source_image: sourceImage,
        target_image: targetFace,
      },
    }
  );

  return output[0]; // URL of the face-swapped image
}
