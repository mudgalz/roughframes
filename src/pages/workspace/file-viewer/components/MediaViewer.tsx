import type { FileRow } from "@/lib/types";
import useAnnotationStore from "../hooks/use-annotation-store";
import { useFeedbakStore } from "../hooks/use-feedback-store";
import ImageKanvas from "./canvas/Imagekanvas";
import { KanvasToolbar } from "./KanvasToolbar";

export const MediaPreview = (props: { file: FileRow }) => {
  const file = props.file;
  const fileType = props.file.file_type;

  const { annotations, liveAnnotation } = useAnnotationStore();
  const { activeFeedback } = useFeedbakStore();

  const committedAnnotations = activeFeedback?.annotations ?? annotations;

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      {fileType === "image" ? (
        <div className="w-full h-full flex bgred">
          <KanvasToolbar />
          <ImageKanvas
            width={file.width}
            height={file.height}
            imageUrl={file.file_url}
            annotations={committedAnnotations}
            liveAnnotation={activeFeedback ? null : liveAnnotation}
            readOnly={!!activeFeedback}
          />
        </div>
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
