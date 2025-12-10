import { Card } from "@/components/ui/card";
import type { FileRow } from "@/lib/types";
import { CirclePlay } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FileCardProps {
  file: FileRow;
}

export function FileCard({ file }: FileCardProps) {
  const navigate = useNavigate();
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleClick = () => {
    navigate(`file/${file.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="overflow-visible hover:shadow-[0_0_10px_var(--color-indigo-700)] gap-4 hover:border-indigo-600 p-2 rounded-md">
      {/* Thumbnail */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden rounded">
        <img
          loading="lazy"
          src={file.thumbnail_url || "/placeholder.svg"}
          alt={file.filename}
          className="w-full h-full object-cover"
        />
        {file.file_type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="p-2 rounded-full bg-card/50">
              <CirclePlay className="w-6 h-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-1.5 pb-1.5 pt-0.5 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0 flex justify-between gap-1">
            <h3
              className="truncate leading-tight text-sm"
              title={file.filename + "." + file.format}>
              {file.filename}.{file.format}
            </h3>
            <p className="text-xs text-nowrap text-muted-foreground leading-tight">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground leading-tight mt-0.5">
          <p>Uploaded by: {file.uploaded_by}</p>
        </div>
      </div>
    </Card>
  );
}
