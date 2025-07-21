import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface SDXLInput {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  scheduler?: string;
  num_outputs?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
}

export async function generateFantasyImage(input: SDXLInput): Promise<string> {
  const defaultInput: SDXLInput = {
    width: 1024,
    height: 1024,
    prompt: input.prompt,
    negative_prompt: "blurry, distorted, low quality, no face, bad anatomy, deformed, back of head",
    scheduler: "K_EULER",
    num_outputs: 1,
    guidance_scale: 7.5,
    num_inference_steps: 30,
  };

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: defaultInput,
      }
    );

    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }

    throw new Error("No image returned from SDXL");
  } catch (error) {
    console.error("❌ Error in generateFantasyImage:", error);
    throw error;
  }
}
