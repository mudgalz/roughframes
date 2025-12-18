import type { FileRow } from "@/lib/types";
import ImageKanvas from "./canvas/Imagekanvas";

export const MediaPreview = (props: { file: FileRow }) => {
  const file = props.file;
  const fileType = props.file.file_type;
  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      {fileType === "image" ? (
        <ImageKanvas
          width={file.width}
          height={file.height}
          imageUrl={file.file_url}
        />
      ) : (
        <video
          src={file.file_url}
          controls
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      )}
    </div>
  );
};
