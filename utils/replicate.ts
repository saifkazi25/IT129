export async function generateFantasyImage(prompt: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc", // SDXL model
        input: {
          prompt: `A fantasy character standing confidently in the center of the scene, full face directly forward. The face should be clearly visible and expressive. Include the full body, outfit, and eventful background: ${prompt}`,
          refine: "no_refiner",
          width: 1024,
          height: 1024,
          scheduler: "K_EULER",
          num_outputs: 1,
          num_inference_steps: 45,         // Increased from 30 → better detail
          guidance_scale: 7.5,             // Increased from 7.5 → stronger adherence to prompt
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ SDXL API error:", result);
      return null;
    }

    const predictionId = result.id;

    // Polling loop
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

      await new Promise((r) => setTimeout(r, 1000)); // wait 1s
    }

    return imageUrl;
  } catch (error) {
    console.error("🔥 generateFantasyImage error:", error);
    return null;
  }
}
