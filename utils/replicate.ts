export async function generateFantasyImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        input: {
          prompt: `A full-body portrait of a confident person standing in the center, facing forward with a clearly visible, expressive face. The outfit, pose, and visual style are inspired by: ${prompt}. The background should be a rich, immersive environment that also reflects those same inspirations — incorporating locations, colors, objects, or moods based on: ${prompt}. Make the entire scene fun, dynamic, and cinematic.`,
          refine: "no_refiner",
          width: 1024,
          height: 1024,
          scheduler: "K_EULER",
          num_outputs: 1,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ SDXL API error:", result);
      return null;
    }

    const predictionId = result.id;

    // Polling loop until image is ready
    let imageUrl = null;
    while (!imageUrl) {
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      const pollResult = await poll.json();

      if (pollResult.status === "succeeded") {
        imageUrl = pollResult.output?.[0] || null;
      } else if (pollResult.status === "failed") {
        console.error("❌ SDXL generation failed:", pollResult);
        return null;
      }

      await new Promise((r) => setTimeout(r, 1000)); // 1s wait
    }

    return imageUrl;
  } catch (error) {
    console.error("🔥 generateFantasyImage error:", error);
    return null;
  }
}

