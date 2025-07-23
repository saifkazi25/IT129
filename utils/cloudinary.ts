import axios from 'axios';

export async function uploadImageToCloudinary(imageUrl: string): Promise<string> {
  console.log('⬆️ Uploading fantasy image to Cloudinary:', imageUrl);

  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', 'infinite_tsukuyomi');

  const response = await axios.post(
    'https://api.cloudinary.com/v1_1/djm1jppes/image/upload',
    formData
  );

  const uploadedUrl = response.data.secure_url;
  console.log('☁️ Cloudinary uploaded URL:', uploadedUrl);

  return uploadedUrl;
}
