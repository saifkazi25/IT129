import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImageToCloudinary(imageDataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imageDataUrl, { folder: 'infinite-tsukuyomi' }, (error, result) => {
      if (error || !result?.secure_url) {
        reject(error || new Error("Upload failed"));
      } else {
        resolve(result.secure_url);
      }
    });
  });
}
