import { create } from "zustand";
import type { FeedbackRow } from "@/lib/types";

type FeedbackMode = "single" | "multiple";

interface FeedbackDraftStore {
  isOpen: boolean;
  mode: FeedbackMode;

  activeFeedback: FeedbackRow | null;

  startNew: (mode?: FeedbackMode) => void;
  openExisting: (feedback: FeedbackRow) => void;

  setMode: (mode: FeedbackMode) => void;
  resetAll: () => void;
}

export const useFeedbackDraftStore = create<FeedbackDraftStore>((set) => ({
  isOpen: false,
  mode: "single",
  activeFeedback: null,

  startNew: (mode = "single") =>
    set({
      isOpen: true,
      mode,
      activeFeedback: null,
    }),

  openExisting: (feedback) =>
    set({
      isOpen: false,
      activeFeedback: feedback,
      mode: feedback.annotations.length > 1 ? "multiple" : "single",
    }),

  setMode: (mode) => set({ mode }),

  resetAll: () =>
    set({
      isOpen: false,
      mode: "single",
      activeFeedback: null,
    }),
}));
