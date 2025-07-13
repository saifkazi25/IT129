import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(base64Image: string): Promise<string> {
  const uploadResponse = await cloudinary.uploader.upload(base64Image, {
    folder: 'infinite-tsukuyomi',
  });
  return uploadResponse.secure_url;
}
