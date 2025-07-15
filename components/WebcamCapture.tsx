const capture = useCallback(() => {
  if (!webcamRef.current) {
    console.error("❌ Webcam ref is null");
    setError("Webcam not ready. Please try again.");
    return;
  }

  const imageSrc = webcamRef.current.getScreenshot();

  if (!imageSrc) {
    console.error("❌ Screenshot failed. getScreenshot() returned null");
    setError("Failed to capture selfie. Try again.");
    return;
  }

  console.log("✅ Screenshot captured. Saving selfie to localStorage...");
  localStorage.setItem("selfie", imageSrc);
  setCaptured(true);

  // 💥 Add delay to ensure write completes
  setTimeout(() => {
    const confirmSelfie = localStorage.getItem("selfie");
    if (!confirmSelfie) {
      console.error("❌ Selfie not found in localStorage after delay");
      setError("Something went wrong. Please retry.");
      return;
    }

    console.log("🚀 Navigating to result page...");
    router.push("/result");
  }, 500); // <-- 500ms wait to fully commit the image
}, [router]);
