import axios, { AxiosError } from "axios";
import type { CloudinaryUploadResponse } from "./types";

const getThumbnailUrl = (url: string, type: string) => {
  if (type == "video") {
    return url
      .replace("/upload/", "/upload/so_1,f_jpg,q_40/")
      .replace(/\.[^/.]+$/, ".png");
  }

  if (type == "image") {
    return url.replace("/upload/", "/upload/q_20,f_auto/");
  }

  // PDFs, docs → still generate preview image
  return url.replace("/upload/", "/upload/pg_1,f_jpg,q_40/");
};

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<
  CloudinaryUploadResponse & {
    thumbnail_url: string;
  }
> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

  try {
    const res = await axios.post<CloudinaryUploadResponse>(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD
      }/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded / (e.total ?? 1)) * 100);
          onProgress?.(percent);
        },
      }
    );

    const data = res.data;
    const thumbnail_url = getThumbnailUrl(data.secure_url, data.resource_type);
    return {
      ...data,
      thumbnail_url,
    };
  } catch (err) {
    const error = err as AxiosError;
    const message =
      (error.response?.data as any)?.error?.message ||
      error.message ||
      "Cloudinary upload failed";

    throw new Error(message);
  }
};
