import { useUploadFiles } from "@/hooks/use-files";
import { FilesIcon } from "lucide-react";
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
        }   fixed inset-0 outline-2 outline-indigo-400 flex items-center justify-center bg-indigo-600/60 backdrop-blur-xs duration-300 size-[98%] m-auto rounded-3xl`}>
        <div className="flex flex-col items-center gap-2 text-white text-shadow-sm text-shadow-indigo-950">
          <FilesIcon className="size-14" />
          <div className="text-4xl font-bold">Drop files to upload</div>
        </div>
      </div>
    </div>
  );
}
