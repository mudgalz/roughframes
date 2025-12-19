import type { FeedbackRow } from "@/lib/types";
import { create } from "zustand";

interface FeedbackStore {
  activeFeedback: FeedbackRow | null;
  openExisting: (feedback: FeedbackRow) => void;
  clear: () => void;
}

export const useFeedbakStore = create<FeedbackStore>((set) => ({
  activeFeedback: null,
  openExisting: (feedback) => set({ activeFeedback: feedback }),
  clear: () => set({ activeFeedback: null }),
}));
