import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(base64Image: string): Promise<string> {
  const result = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
    folder: "infinite_tsukuyomi",
  });

  return result.secure_url;
}
