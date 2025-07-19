const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = "infinite_tsukuyomi";

export const uploadImageToCloudinary = async (base64: string): Promise<string> => {
  if (!CLOUD_NAME) throw new Error("Missing CLOUDINARY_CLOUD_NAME");

  const formData = new FormData();
  formData.append("file", base64);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed.");
  }

  return data.secure_url;
};
