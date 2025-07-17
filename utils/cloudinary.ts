import axios from "axios";

const CLOUD_NAME = "djm1jppes";
const UPLOAD_PRESET = "infinite_tsukuyomi";

export default async function uploadToCloudinary(base64Image: string) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", base64Image);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(url, formData);
  return response.data.secure_url;
}
