import { NextResponse } from "next/server";
import { mergeFaces } from "../../../utils/facefusion";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const { selfieUrl, fantasyImageUrl } = JSON.parse(body);

    console.log("🚀 /api/merge called");
    console.log("📸 Selfie URL:", selfieUrl);
    console.log("🖼️ Fantasy Image URL:", fantasyImageUrl);

    if (!selfieUrl || !fantasyImageUrl) {
      return NextResponse.json({ error: "Missing selfie or fantasy image" }, { status: 400 });
    }

    const mergedImageUrl = await mergeFaces(selfieUrl, fantasyImageUrl);
    console.log("🧠 Merged Image URL:", mergedImageUrl);

    if (!mergedImageUrl) {
      return NextResponse.json({ error: "Face merging failed" }, { status: 500 });
    }

    return NextResponse.json({ mergedImageUrl });
  } catch (error: any) {
    console.error("🔥 /api/merge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
