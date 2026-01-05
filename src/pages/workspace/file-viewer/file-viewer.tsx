import { Spinner } from "@/components/ui/spinner";
import { useSingleFile } from "@/hooks/use-files";
import { useParams } from "react-router-dom";
import { FeedbackPanel } from "./components/feedback/feedback-panel";
import FileHeader from "./components/FileHeader";
import { MediaPreview } from "./components/MediaViewer";
import { useFeedbackPanel } from "./hooks/use-feedback-panel";

const FileViewer = () => {
  const { isOpen } = useFeedbackPanel();
  const { fileId } = useParams();
  const { data, isLoading } = useSingleFile(fileId as string);
  if (isLoading)
    return <Spinner className="absolute top-1/2 left-1/2 size-8" />;
  if (!data)
    return (
      <div className="absolute top-1/2 left-1/2 ">
        <p>No Data Found</p>
      </div>
    );
  return (
    <div className="h-screen flex flex-col gap-0.5 overflow-hidden p-0.5">
      <FileHeader file={data} />

      <div className="flex flex-1 gap-0.5 overflow-hidden">
        <div className="flex-1 bg-muted/50 rounded-sm overflow-hidden">
          <MediaPreview file={data} />
        </div>

        {isOpen && (
          <div className="basis-3/12 bg-muted/50 rounded-sm overflow-auto">
            <FeedbackPanel fileId={data.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
