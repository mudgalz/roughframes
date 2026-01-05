import type { FileRow } from "@/lib/types";
import useAnnotationStore from "../hooks/use-annotation-store";
import { useFeedbackStore } from "../hooks/use-feedback-store";
import ImageFile from "./canvas/image-file";
import PdfFile from "./canvas/pdf-file";

export const MediaPreview = (props: { file: FileRow }) => {
  const file = props.file;
  const fileType = props.file.file_type;

  const { annotations } = useAnnotationStore();
  const { activeFeedback } = useFeedbackStore();

  const committedAnnotations = activeFeedback?.annotations ?? annotations;

  return (
    <div className="w-full h-full flex items-center justify-center">
      {fileType === "image" ? (
        <ImageFile file={file} annotations={committedAnnotations} />
      ) : fileType === "raw" ? (
        <PdfFile pdfUrl={file.file_url} annotations={committedAnnotations} />
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
