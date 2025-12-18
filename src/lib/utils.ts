import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ValidatedFile {
  file: File;
  type: "image" | "video" | "raw";
}

interface FileValidationError {
  file: File;
  reason: string;
}

interface ValidateResult {
  valid: ValidatedFile[];
  errors: FileValidationError[];
}

export function validateFiles(files: File[]): ValidateResult {
  const valid: ValidatedFile[] = [];
  const errors: FileValidationError[] = [];

  for (const file of files) {
    const mime = file.type;

    let type: ValidatedFile["type"] | null = null;
    if (mime.startsWith("image/")) type = "image";
    else if (mime.startsWith("video/")) type = "video";
    else type = "raw";

    if (!type) {
      errors.push({
        file,
        reason: "Unsupported file type.",
      });
      continue;
    }

    // size limits
    const maxSizeMb = type === "image" ? 10 : type === "video" ? 50 : 20; // pdf

    if (file.size > maxSizeMb * 1024 * 1024) {
      errors.push({
        file,
        reason: `File too large. Max allowed: ${maxSizeMb}MB`,
      });
      continue;
    }

    valid.push({ file, type });
  }

  return { valid, errors };
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
