import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(imageUrl: string): Promise<string> {
  console.log('☁️ Uploading to Cloudinary:', imageUrl);

  const res = await cloudinary.v2.uploader.upload(imageUrl, {
    folder: 'infinite_tsukuyomi',
  });

  console.log('✅ Cloudinary response:', res);
  return res.secure_url;
}
