import type { FileRow } from "@/lib/types";
import { KanvasToolbar } from "../KanvasToolbar";
import ImageKanvas from "./Imagekanvas";
import type { Annotation } from "../../types";

interface Props {
  file: FileRow;
  annotations: Annotation[];
}

export default function ImageFile(props: Props) {
  const { file, annotations } = props;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <ImageKanvas
          width={file.width}
          height={file.height}
          imageUrl={file.file_url}
          annotations={annotations}
        />
      </div>

      <KanvasToolbar />
    </div>
  );
}
