import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(imageDataUrl: string): Promise<string> {
  try {
    const res = await cloudinary.uploader.upload(imageDataUrl, {
      folder: 'infinite-tsukuyomi',
    });
    return res.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw new Error('Failed to upload to Cloudinary');
  }
}
