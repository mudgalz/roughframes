import { clamp } from "@/lib/utils";
import { create } from "zustand";

interface Point {
  x: number;
  y: number;
}

interface KanvasStore {
  viewScale: number;
  viewOffset: Point;

  zoomIn: () => void;
  zoomOut: () => void;
  zoomAtPoint: (point: Point, delta: number) => void;

  resetView: () => void;
  pan: (dx: number, dy: number) => void;
  setViewOffset: (offset: Point) => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_STEP = 1.15;
const WHEEL_STEP = 1.1;

export const useKanvasStore = create<KanvasStore>((set) => ({
  viewScale: 1,
  viewOffset: { x: 0, y: 0 },

  zoomIn: () =>
    set((state) => ({
      viewScale: clamp(state.viewScale * ZOOM_STEP, MIN_SCALE, MAX_SCALE),
    })),

  zoomOut: () =>
    set((state) => ({
      viewScale: clamp(state.viewScale / ZOOM_STEP, MIN_SCALE, MAX_SCALE),
    })),
  zoomAtPoint: (point, delta) =>
    set((state) => {
      const oldScale = state.viewScale;
      const scaleFactor = delta > 0 ? 1 / WHEEL_STEP : WHEEL_STEP;
      const newScale = clamp(oldScale * scaleFactor, MIN_SCALE, MAX_SCALE);

      // ✅ IMPORTANT FIX
      if (newScale === oldScale) {
        return {}; // or return undefined;
      }

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

  setViewOffset: (offset) =>
    set({
      viewOffset: offset,
    }),
}));
