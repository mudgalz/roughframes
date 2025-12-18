import { create } from "zustand";

interface KanvasStore {
  viewScale: number;
  viewOffset: { x: number; y: number };

  zoomIn: () => void;
  zoomOut: () => void;
  zoomAtPoint: (point: { x: number; y: number }, delta: number) => void;

  resetView: () => void;
  pan: (dx: number, dy: number) => void;
}

export const useKanvasStore = create<KanvasStore>((set) => ({
  viewScale: 1,
  draftPin: null,
  viewOffset: { x: 0, y: 0 },

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
}));
