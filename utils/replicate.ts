import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

function sanitizePrompt(prompt: string): string {
  return prompt
    .replace(/Anti Hero/gi, 'brave warrior')
    .replace(/cape/gi, 'battle robe')
    .replace(/fire/gi, 'elemental power')
    .replace(/nsfw|nude|naked|sexy|erotic/gi, '');
}

export async function runSDXL(prompt: string): Promise<string> {
  const cleanedPrompt = sanitizePrompt(prompt);

  const runGeneration = async () => {
    return await replicate.run(
      'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
      {
        input: {
          width: 768,
          height: 768,
          prompt: cleanedPrompt,
          refine: 'expert_ensemble_refiner',
          scheduler: 'K_EULER',
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          prompt_strength: 0.8,
          num_inference_steps: 25,
          negative_prompt:
            'nsfw, nude, sexual, erotic, cleavage, underwear, revealing, explicit, suggestive, skin, inappropriate',
        },
      }
    );
  };

  try {
    const output = await runGeneration();
    console.log('🧪 Raw SDXL output:', output);
    if (Array.isArray(output) && typeof output[0] === 'string') {
      return output[0];
    }
    throw new Error('Invalid SDXL output format');
  } catch (err: any) {
    if (
      err?.message?.includes('NSFW content detected') ||
      err?.toString().includes('NSFW content detected')
    ) {
      console.warn('⚠️ NSFW block — retrying with slight variation...');
      const fallbackPrompt = cleanedPrompt + ' wearing armor, peaceful tone';
      const output = await replicate.run(
        'stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
        {
          input: {
            width: 768,
            height: 768,
            prompt: fallbackPrompt,
            refine: 'expert_ensemble_refiner',
            scheduler: 'K_EULER',
            lora_scale: 0.6,
            num_outputs: 1,
            guidance_scale: 7.5,
            apply_watermark: false,
            high_noise_frac: 0.8,
            prompt_strength: 0.8,
            num_inference_steps: 25,
            negative_prompt:
              'nsfw, nude, sexual, erotic, cleavage, underwear, revealing, explicit, suggestive, skin, inappropriate',
          },
        }
      );
      console.log('🧪 Raw SDXL retry output:', output);
      if (Array.isArray(output) && typeof output[0] === 'string') {
        return output[0];
      }
    }

    console.error('❌ SDXL generation failed:', err);
    throw err;
  }
}

export async function runFaceFusion(targetUrl: string, sourceUrl: string): Promise<string> {
  try {
    const output = await replicate.run(
      'lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7',
      {
        input: {
          user_image: sourceUrl,
          template_image: targetUrl,
          batch_size: 1,
          use_enhancer: true,
        },
      }
    );

    console.log('🧪 Raw FaceFusion output:', output);

    if (typeof output === 'string') {
      return output;
    }

    if (Array.isArray(output) && typeof output[0] === 'string') {
      return output[0];
    }

    throw new Error('Invalid FaceFusion output format');
  } catch (err: any) {
    console.error('❌ Error in runFaceFusion:', err?.message || err);
    throw err;
  }
}
