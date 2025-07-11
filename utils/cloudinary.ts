import cloudinary from 'cloudinary';
import { Readable } from 'stream';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Accept base64 string instead of Buffer
export async function uploadToCloudinary(base64: string): Promise<{ secure_url: string }> {
  return new Promise((resolve, reject) => {
    // Strip data URI prefix if present
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'infinite-tsukuyomi' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as { secure_url: string });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
