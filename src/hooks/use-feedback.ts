import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFeedback,
  deleteFeedback,
  getFeedbackForFile,
  updateFeedbackComment,
} from "../lib/db";
import type { FeedbackRow } from "../lib/types";

interface AddFeedbackInput extends Omit<FeedbackRow, "id" | "created_at"> {}

interface UpdateFeedbackInput {
  id: string;
  comment: string | null;
}

type DeleteFeedbackInput = string;

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

export const useFeedbackMutation = (fileId: string) => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: feedbackKeys.list(fileId),
    });

  const add = useMutation({
    mutationFn: (data: AddFeedbackInput) => addFeedback(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: (data: UpdateFeedbackInput) => updateFeedbackComment(data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: DeleteFeedbackInput) => deleteFeedback(id),
    onSuccess: invalidate,
  });

  return {
    add,
    update,
    remove,
  };
};
