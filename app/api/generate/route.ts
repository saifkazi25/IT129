      replicate.run(
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        {
          input: {
            prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
          },
        }
      )
    )) as string[];

    const fantasyImage = sdxlResult[0];
    console.log("🔍 Raw SDXL result:", sdxlResult);

    // Step 2: Face Fusion
    const fusionResult = await runWithRetry(() =>
      replicate.run(
        "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
        {
          input: {
            user_image: image,
            template_image: fantasyImage,
          },
        }
      )
    );

    console.log("✅ FaceFusion complete:", fusionResult);

    return NextResponse.json({ result: fusionResult });
  } catch (error) {
    console.error("❌ Unexpected failure in API route:", error);
    return NextResponse.json(
      { error: "Failed to generate fantasy image." },
      { status: 500 }
    );
  }
}
