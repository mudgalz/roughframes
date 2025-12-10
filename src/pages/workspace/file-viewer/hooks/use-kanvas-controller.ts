import { create } from "zustand";

export type Tool = "none" | "pin" | "rect";

interface KanvasStore {
  viewScale: number;
  viewOffset: { x: number; y: number };
  activeTool: Tool;
  natural: { w: number; h: number } | null;
  draftPin: { x: number; y: number } | null;

  setTool: (tool: Tool) => void;
  setNaturalSize: (w: number, h: number) => void;

  zoomIn: () => void;
  zoomOut: () => void;
  zoomAtPoint: (point: { x: number; y: number }, delta: number) => void;

  resetView: () => void;
  pan: (dx: number, dy: number) => void;
  setDraftPin: (p: { x: number; y: number } | null) => void;
}

export const useKanvasStore = create<KanvasStore>((set) => ({
  viewScale: 1,
  draftPin: null,
  viewOffset: { x: 0, y: 0 },

  activeTool: "none",
  natural: null,

  setTool: (tool) => set({ activeTool: tool }),

  setNaturalSize: (w, h) => set({ natural: { w, h } }),

  // Simple zoom — toolbar buttons
  zoomIn: () =>
    set((state) => ({
      viewScale: Math.min(state.viewScale * 1.15, 8),
    })),

  zoomOut: () =>
    set((state) => ({
      viewScale: Math.max(state.viewScale / 1.15, 0.2),
    })),

  // Accurate zoom (scroll wheel zoom)
  zoomAtPoint: (point, delta) =>
    set((state) => {
      const scaleBy = 1.1;
      const oldScale = state.viewScale;
      const newScale = delta > 0 ? oldScale / scaleBy : oldScale * scaleBy;

      return {
        viewScale: newScale,
        viewOffset: {
          x: point.x - (point.x - state.viewOffset.x) * (newScale / oldScale),
          y: point.y - (point.y - state.viewOffset.y) * (newScale / oldScale),
        },
      };
    }),

  resetView: () =>
    set({
      viewScale: 1,
      viewOffset: { x: 0, y: 0 },
    }),

  pan: (dx, dy) =>
    set((state) => ({
      viewOffset: {
        x: state.viewOffset.x + dx,
        y: state.viewOffset.y + dy,
      },
    })),
  setDraftPin: (p) => set({ draftPin: p }),
}));
