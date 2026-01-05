import { useEffect } from "react";
import { useFeedbackStore } from "../../hooks/use-feedback-store";
import FeedbackField from "./feedback-field";
import { FeedbackList } from "./feedback-list";

interface FeedbackPanelProps {
  fileId: string;
}

export const FeedbackPanel = ({ fileId }: FeedbackPanelProps) => {
  const { clear } = useFeedbackStore();
  useEffect(() => {
    return () => clear();
  }, []);
  return (
    <div className="flex flex-col h-full p-4 space-y-4 custom-scroll overflow-y-auto">
      <FeedbackField fileId={fileId} />

      <FeedbackList fileId={fileId} />
    </div>
  );
};
