import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export async function generateFantasyImage(answers: string[]): Promise<string> {
  const prompt = `a cinematic portrait of a ${answers[2]} in a ${answers[3]}, in ${answers[1]}, set in the ${answers[0]}, from the ${answers[4]}, theme of ${answers[5]} and ${answers[6]}, facing camera, hyper-realistic, fantasy style`;
  
  const output = await replicate.run(
    'stability-ai/sdxl:db21e45c69b0b3f60a194da3e1348c6ce6975d49b9be4f56ec22b7f525d81f3b',
    {
      input: {
        prompt,
        width: 768,
        height: 768
      }
    }
  );

  return Array.isArray(output) ? output[0] : output as string;
}

export async function mergeFace(backgroundUrl: string, selfieUrl: string): Promise<string> {
  try {
    const output = await replicate.run(
      'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      {
        input: {
          source_image: selfieUrl,
          target_image: backgroundUrl,
        },
      }
    );

    return Array.isArray(output) ? output[0] : output as string;
  } catch (error) {
    console.error('❌ FaceFusion Error:', error);
    throw new Error('FaceFusion merge failed');
  }
}
