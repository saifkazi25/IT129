
import type { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

// 1️⃣  Make sure this value is set in Vercel → Settings → Environment Variables
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || '',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST
  if (req.method !== 'POST') return res.status(405).end();

  const { answers, image } = req.body;

  // Basic validation
  if (!Array.isArray(answers) || answers.length !== 7) {
    return res.status(400).json({ error: 'answers must be an array of 7 strings' });
  }
  if (typeof image !== 'string' || !image.startsWith('data:image/jpeg;base64,')) {
    return res.status(400).json({ error: 'image must be a base64 JPEG string' });
  }

  try {
    // Build an imaginative prompt from the seven answers
    const prompt = `Create a fantasy portrait embodying:
      • Mood: ${answers[0]}
      • Setting: ${answers[1]}
      • Character Type: ${answers[2]}
      • Outfit: ${answers[3]}
      • Background: ${answers[4]}
      • Vibe/Theme: ${answers[5]}
      • Super-power: ${answers[6]}
    — blend the person’s selfie seamlessly into this world.`;

    // 🔄  Call Replicate (replace model/version if you’re using a different one)
    const output = await replicate.run(
      'lucataco/modelscope-facefusion:db21c1c7db5f8eb85846c55d9298760e72123708f3420f9ef1f
