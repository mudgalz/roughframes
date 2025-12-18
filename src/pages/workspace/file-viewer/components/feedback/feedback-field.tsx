import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { useFeedbackMutation } from "@/hooks/use-feedback";
import { useUser } from "@/hooks/use-user";
import { CircleDot, CircleEllipsis, Send } from "lucide-react";
import { useState } from "react";
import { useAnnotationStore } from "../../hooks/use-annotation";
import { useFeedbackDraftStore } from "../../hooks/use-feedback-draft";
import { Spinner } from "@/components/ui/spinner";

export default function FeedbackField(props: { fileId: string }) {
  const { fileId } = props;
  const [comment, setComment] = useState("");
  const user = useUser((s) => s.user);

  const { mode, startNew, resetAll, setMode } = useFeedbackDraftStore();
  const { add } = useFeedbackMutation(fileId);
  const { setTool, annotations, clearAnnotations } = useAnnotationStore();
  const handleStart = () => {
    startNew("single");
    setTool("pin");
  };

  const handleCancel = () => {
    resetAll();
    setTool("none");
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
    resetAll();
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
        <Toggle
          title={`Toggle ${mode} annotation mode`}
          aria-label="Toggle multiple annotations"
          pressed={mode === "multiple"}
          onPressedChange={(pressed) =>
            setMode(pressed ? "multiple" : "single")
          }>
          {mode === "multiple" ? (
            <CircleEllipsis className="size-5" />
          ) : (
            <CircleDot className="size-5" />
          )}
        </Toggle>

        <div className="flex gap-2 items-center">
          {isAdding && (
            <Button size={"sm"} variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            size={"sm"}
            className="bg-indigo-400 p-0 hover:bg-indigo-500">
            {add.isPending ? <Spinner /> : <Send />}
          </Button>
        </div>
      </div>
    </div>
  );
}
