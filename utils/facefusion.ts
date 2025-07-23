export async function mergeFaces(userImageUrl: string, templateImageUrl: string): Promise<string> {
  console.log("📸 Merging selfie:", userImageUrl);
  console.log("🖼️ With fantasy image:", templateImageUrl);

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7", // FaceFusion model
      input: {
        user_image: userImageUrl,
        template_image: templateImageUrl,
        version: "v1.2", // Optional, based on FaceFusion model versioning
        similarity: 0.85 // Optional: can tweak face blending strength
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("❌ FaceFusion failed:", error);
    throw new Error("FaceFusion merge failed");
  }

  const json = await response.json();
  console.log("🌀 FaceFusion prediction submitted:", json);

  const getResult = async (url: string): Promise<string> => {
    while (true) {
      const res = await fetch(url, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      const data = await res.json();
      if (data.status === "succeeded") {
        console.log("✅ FaceFusion final result:", data.output);
        return data.output;
      } else if (data.status === "failed") {
        console.error("❌ FaceFusion failed:", data);
        throw new Error("FaceFusion merge failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  };

  return await getResult(json.urls.get);
}
