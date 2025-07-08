
import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { answers, image } = req.body;

  if (!Array.isArray(answers) || answers.length !== 7) {
    return res.status(400).json({ error: 'answers must be an array of 7 strings' });
  }

  if (typeof image !== 'string' || !image.startsWith('data:image/jpeg;base64,')) {
    return res.status(400).json({ error: 'image must be a base64 JPEG string' });
  }

  try {
    const prompt = \`Create a fantasy portrait embodying:
      • Mood: \${answers[0]}
      • Setting: \${answers[1]}
      • Character Type: \${answers[2]}
      • Outfit: \${answers[3]}
      • Background: \${answers[4]}
      • Vibe/Theme: \${answers[5]}
      • Super-power: \${answers[6]}
    — blend the person’s selfie seamlessly into this world.\`;

    const output = await replicate.run(
      'lucataco/modelscope-facefusion:db21c1c7db5f8eb85846c55d9298760e72123708f3420f9ef1f25357c25aef2d',
      {
        input: {
          image_base64: image,
          prompt
        }
      }
    );

    res.status(200).json({ image: output });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong', details: error });
  }
}
