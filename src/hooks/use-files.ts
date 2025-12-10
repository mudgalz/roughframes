import { uploadToCloudinary } from "@/lib/cloudinary";
import { validateFiles } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSingleFile, getWorkspaceFiles, uploadFileRow } from "../lib/db";
import type { FileRow } from "../lib/types";
import { useUploadStore } from "./use-upload";
import { useUser } from "./use-user";

const useFiles = () => {
  return useQuery<FileRow[]>({
    queryKey: ["files"],
    queryFn: getWorkspaceFiles,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

const useSingleFile = (id: string) => {
  return useQuery<FileRow>({
    queryKey: ["files", id],
    queryFn: () => getSingleFile(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

const useUploadFiles = () => {
  const queryClient = useQueryClient();
  const user = useUser((e) => e.user);

  const { startUpload, markSuccess, markError } = useUploadStore();

  return useMutation({
    mutationFn: async (files: File[]) => {
      const { valid, errors } = validateFiles(files);

      errors.forEach((err) => {
        toast.error(`${err.file.name}: ${err.reason}`);
      });

      const tasks = valid.map(async ({ file, type }) => {
        const id = crypto.randomUUID();
        startUpload(id, file.name);

        try {
          const uploaded = await uploadToCloudinary(file);

          const row = await uploadFileRow({
            file_url: uploaded.secure_url,
            file_type: type,
            uploaded_by: user?.name ?? "Guest",
            width: uploaded.width,
            height: uploaded.height,
            filename: uploaded.original_filename,
            thumbnail_url: uploaded.thumbnail_url,
            size: uploaded.bytes,
            format: uploaded.format,
          });

          markSuccess(id);

          return row;
        } catch (err: any) {
          markError(id, err.message);
          return null; // fail-safe
        }
      });

      // Wait for all uploads (fail or succeed)
      const results = await Promise.allSettled(tasks);

      // Return only successful uploads
      return results
        .filter(
          (r): r is PromiseFulfilledResult<FileRow | null> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value)
        .filter((x): x is FileRow => x !== null);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
};

export { useFiles, useUploadFiles, useSingleFile };
