// hooks/use-annotation.ts
import { create } from "zustand";
import type { Annotation, Shape } from "../types";

interface AnnotationStore {
  activeShape: Shape;
  activeColor: string;

  annotations: Annotation[];
  liveAnnotation: Annotation | null;

  undoStack: Annotation[][];

  setShape: (tool: Shape) => void;
  setColor: (color: string) => void;

  commitLiveAnnotation: (a: Annotation) => void;

  clearAnnotations: () => void;

  undo: () => void;
}

const useAnnotationStore = create<AnnotationStore>((set) => ({
  activeShape: "none",
  activeColor: "#ef4444",

  annotations: [],
  liveAnnotation: null,

  undoStack: [],

  setShape: (tool) => set({ activeShape: tool }),
  setColor: (color) => set({ activeColor: color }),

  commitLiveAnnotation: (live) => {
    if (!live) return;

    set((state) => ({
      undoStack: [...state.undoStack, state.annotations],
      redoStack: [],
      annotations: [...state.annotations, live],
      liveAnnotation: null,
    }));
  },

  clearAnnotations: () =>
    set({
      annotations: [],
      undoStack: [],
      liveAnnotation: null,
    }),

  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;

      const prev = state.undoStack[state.undoStack.length - 1];

      return {
        annotations: prev,
        undoStack: state.undoStack.slice(0, -1),
      };
    }),
}));

export default useAnnotationStore;
