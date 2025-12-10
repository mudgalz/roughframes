import { create } from "zustand";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadItemState {
  id: string;
  name: string;
  progress: number; // 0 → 100
  status: UploadStatus;
  error?: string;
}

interface UploadStore {
  uploads: Record<string, UploadItemState>;

  startUpload: (id: string, name: string) => void;
  setProgress: (id: string, progress: number) => void;
  markSuccess: (id: string) => void;
  markError: (id: string, error: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: {},

  startUpload: (id, name) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: { id, name, progress: 0, status: "uploading" },
      },
    })),

  setProgress: (id, progress) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: { ...state.uploads[id], progress },
      },
    })),

  markSuccess: (id) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: { ...state.uploads[id], progress: 100, status: "success" },
      },
    })),

  markError: (id, error) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: { ...state.uploads[id], status: "error", error },
      },
    })),

  reset: () => set({ uploads: {} }),
}));
