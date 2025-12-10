import { useUploadFiles } from "@/hooks/use-files";
import { type PropsWithChildren } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function DropzoneWrapper({ children }: PropsWithChildren) {
  const uploadFiles = useUploadFiles();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadFiles.mutate(acceptedFiles);
      }
    },
    accept: {
      "video/*": [".mp4", ".mkv", ".webm"],
      "image/*": [".png", ".jpg", ".webp"],
    },
    onDropRejected: (fileRejections) => {
      const rejectedNames = fileRejections.map((r) => r.file.name).join(", ");

      toast.error(`Unsupported files(s): ${rejectedNames}`);
    },
  });

  return (
    <div {...getRootProps()} className="relative w-full h-full flex-1">
      <input {...getInputProps()} />

      {children}

      <div
        className={`${
          isDragActive
            ? "opacity-100 scale-100 z-50"
            : "opacity-0 scale-105 -z-10"
        }   fixed inset-0 outline-2 outline-indigo-500 flex items-center justify-center bg-indigo-800/60 backdrop-blur-xs duration-300 size-[98%] m-auto rounded-3xl`}>
        <div className="text-white text-4xl font-bold">
          Drop files to upload
        </div>
      </div>
    </div>
  );
}
