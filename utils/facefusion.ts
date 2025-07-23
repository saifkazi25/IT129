export async function mergeFaces(selfieUrl: string, fantasyImageUrl: string): Promise<string | null> {
  try {
    console.log("📸 Merging selfie:", fantasyImageUrl);
    console.log("🖼️ With fantasy image:", selfieUrl);

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7", // FaceFusion
        input: {
          template_image: fantasyImageUrl, // 🟢 Correct field
          user_image: selfieUrl,           // 🟢 Correct field
          use_cropping: true,
          similarity: 0.8,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ FaceFusion failed:", result);
      return null;
    }

    const predictionId = result.id;

    let mergedImageUrl = null;
    while (!mergedImageUrl) {
      const poll = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      const pollResult = await poll.json();

      if (pollResult.status === "succeeded") {
        mergedImageUrl = pollResult.output?.[0] || null;
      } else if (pollResult.status === "failed") {
        console.error("❌ FaceFusion polling failed:", pollResult);
        return null;
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    return mergedImageUrl;
  } catch (error) {
    console.error("🔥 mergeFaces error:", error);
    return null;
  }
}
