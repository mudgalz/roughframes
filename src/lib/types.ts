interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: "image" | "video" | "raw";
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  asset_folder: string;
  display_name: string;
  existing: boolean;
  original_filename: string;
}

interface FileRow
  extends Pick<CloudinaryUploadResponse, "format" | "width" | "height"> {
  id: string;
  file_type: "image" | "video" | "raw";
  uploaded_by: string | null;
  created_at: string;
  file_url: string;
  thumbnail_url: string;
  size: number;
  filename: string;
}

interface FeedbackRow {
  id: string;
  file_id: string;
  x: number;
  y: number;
  comment: string | null;
  added_by: string | null;
  created_at: string;
}

export type { CloudinaryUploadResponse, FeedbackRow, FileRow };
