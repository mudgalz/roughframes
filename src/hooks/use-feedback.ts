import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFeedback, getFeedbackForFile } from "../lib/db";
import type { FeedbackRow } from "../lib/types";

export const feedbackKeys = {
  list: (fileId: string) => ["feedback", fileId] as const,
};

export const useFeedback = (fileId: string) => {
  return useQuery<FeedbackRow[]>({
    queryKey: feedbackKeys.list(fileId),
    queryFn: () => getFeedbackForFile(fileId),
    enabled: !!fileId,
  });
};

export const useAddFeedback = (fileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<FeedbackRow, "id" | "created_at">) =>
      addFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.list(fileId) });
    },
  });
};
