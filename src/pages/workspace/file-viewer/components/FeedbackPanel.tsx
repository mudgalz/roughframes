import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackPanelProps {
  fileId: string;
}

export const FeedbackPanel = ({ fileId }: FeedbackPanelProps) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <h2 className="text-lg font-medium">Feedback</h2>

      <Textarea placeholder="Write your feedback..." className="flex-1" />

      <Button>Save Feedback</Button>
    </div>
  );
};
