const replicate = require('replicate');

const replicateClient = new replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function runSDXL(quizAnswers: string[]) {
  const prompt = `A fantasy world with ${quizAnswers.join(', ')}. Front-facing character, highly detailed, vibrant.`;

  const output = await replicateClient.run(
    'stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
    { input: { prompt } }
  );

  return output[0];
}

export async function runFaceFusion(selfieUrl: string, baseImageUrl: string) {
  const output = await replicateClient.run(
    'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
    {
      input: {
        source_image: selfieUrl,
        target_image: baseImageUrl,
        face_enhancer: true,
        proportion: 1.0,
      },
    }
  );

  return output[0];
}
