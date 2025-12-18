import { Skeleton } from "@/components/ui/skeleton";
import { useFeedback } from "@/hooks/use-feedback";
import FeedbackItem from "./feedback-item";

interface FeedbackListProps {
  fileId: string;
}

function FeedbackSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`w-full ${i % 2 === 0 ? "h-40" : "h-32"}`}
        />
      ))}
    </div>
  );
}

export function FeedbackList({ fileId }: FeedbackListProps) {
  const { data, isLoading } = useFeedback(fileId);

  if (isLoading) {
    return <FeedbackSkeleton />;
  }

  if (!data?.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        No feedback yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((item) => (
        <FeedbackItem key={item.id} feedback={item} />
      ))}
    </div>
  );
}
