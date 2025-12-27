import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useFeedbackMutation } from "@/hooks/use-feedback";
import { useUser } from "@/hooks/use-user";
import { Send } from "lucide-react";
import { useState } from "react";
import useAnnotationStore from "../../hooks/use-annotation-store";
import { useFeedbakStore } from "../../hooks/use-feedback-store";
import AnnotationToolbar from "../AnnotationToolbar";

export default function FeedbackField(props: { fileId: string }) {
  const { fileId } = props;
  const [comment, setComment] = useState("");
  const user = useUser((s) => s.user);

  const { clear } = useFeedbakStore();
  const { add } = useFeedbackMutation(fileId);
  const { setShape, annotations, clearAnnotations, activeShape } =
    useAnnotationStore();

  const handleStart = () => {
    clear();
    if (activeShape === "none") setShape("rect");
  };

  const handleCancel = () => {
    setShape("none");
    clearAnnotations();
    setComment("");
  };

  const handleSave = async () => {
    const feedback = {
      file_id: fileId,
      comment,
      annotations,
      added_by: user?.name || "Guest",
    };

    await add.mutateAsync(feedback);

    clearAnnotations();
    setComment("");
  };

  const isAdding = comment.length > 0 || annotations.length > 0;
  return (
    <div className="bg-sidebar-accent p-2 rounded-md flex flex-col gap-2">
      <Textarea
        onClick={handleStart}
        placeholder="Write your feedback.."
        value={comment}
        rows={1}
        onChange={(e) => setComment(e.target.value)}
        className="dark:bg-transparent border-none focus-visible:ring-0 resize-none min-h-0 max-h-60 custom-scroll"
      />

      <div className="flex justify-between items-center px-2">
        <AnnotationToolbar />
        <div className="flex gap-2 items-center">
          {isAdding && (
            <Button size={"sm"} variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            size={"sm"}
            disabled={!comment.trimStart()}
            className="bg-indigo-400 p-0 hover:bg-indigo-500">
            {add.isPending ? <Spinner /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
}
