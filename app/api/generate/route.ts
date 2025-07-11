  const body = await req.json();
    const { answers, image } = body;

    // Prompt formatting
    if (!answers || !image) {
      return NextResponse.json(
        { error: "Missing answers or selfie image." },
        { status: 400 }
      );
    }

    const prompt = `Create a fantasy world with these elements: ${answers.join(
      ", "
    )}.`;

    console.log("🧠 Prompt to SDXL:", prompt);

    // Step 1: Generate fantasy image using SDXL
    const sdxlRawResult = (await runWithRetry(() =>
    // Step 1: SDXL Image Generation
    const sdxlResult = (await runWithRetry(() =>
      replicate.run(
        "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        {
@@ -57,15 +62,11 @@ export async function POST(req: NextRequest) {
      )
    )) as string[];

    const fantasyImage = sdxlRawResult[0];
    console.log("🔍 Raw SDXL result:", sdxlRawResult);
    console.log("🧪 SDXL image ready; pausing briefly before FaceFusion...");

    // Short pause to avoid immediate back-to-back API calls
    await new Promise((res) => setTimeout(res, 8000));
    const fantasyImage = sdxlResult[0];
    console.log("🔍 Raw SDXL result:", sdxlResult);

    // Step 2: Merge with selfie using FaceFusion (confirmed working version)
    const faceFusionResult = await runWithRetry(() =>
    // Step 2: Face Fusion
    const fusionResult = await runWithRetry(() =>
      replicate.run(
        "lucataco/modelscope-facefusion:52edbb2b42beb4e19242f0c9ad5717211a96c63ff1f0b0320caa518b2745f4f7",
        {
@@ -77,9 +78,9 @@ export async function POST(req: NextRequest) {
      )
    );

    console.log("✅ FaceFusion complete:", faceFusionResult);
    console.log("✅ FaceFusion complete:", fusionResult);

    return NextResponse.json({ result: faceFusionResult });
    return NextResponse.json({ result: fusionResult });
  } catch (error) {
    console.error("❌ Unexpected failure in API route:", error);
    return NextResponse.json(
@@ -88,6 +89,3 @@ export async function POST(req: NextRequest) {
    );
  }
}
