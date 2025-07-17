import axios from "axios";

export default async function uploadToCloudinary(base64Image: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = "infinite_tsukuyomi";

  if (!cloudName) {
    throw new Error("Missing CLOUDINARY_CLOUD_NAME environment variable");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("upload_preset", uploadPreset);

  const response = await axios.post(url, formData);
  return response.data.secure_url;
}
