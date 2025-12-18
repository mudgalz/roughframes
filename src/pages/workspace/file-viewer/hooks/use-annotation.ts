import { create } from "zustand";
import type { Annotation, Tool } from "../types";

interface AnnotationStore {
  activeTool: Tool;
  annotations: Annotation[];

  // tool control
  setTool: (tool: Tool) => void;

  // annotations
  addAnnotation: (a: Annotation) => void;
  updateAnnotation: <T extends Annotation["tool"]>(
    id: string,
    tool: T,
    patch: Partial<Extract<Annotation, { tool: T }>>
  ) => void;

  removeAnnotation: (id: string) => void;
  clearAnnotations: () => void;
}

export const useAnnotationStore = create<AnnotationStore>((set) => ({
  activeTool: "none",
  annotations: [],
  selectedAnnotationId: null,

  setTool: (tool) => set({ activeTool: tool }),

  addAnnotation: (a) =>
    set((state) => ({
      annotations: [...state.annotations, a],
    })),

  updateAnnotation: (id, tool, patch) =>
    set((state) => ({
      annotations: state.annotations.map<Annotation>((a) => {
        if (a.id !== id || a.tool !== tool) return a;
        return { ...a, ...patch };
      }),
    })),

  removeAnnotation: (id) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== id),
    })),

  clearAnnotations: () =>
    set({
      annotations: [],
    }),
}));
