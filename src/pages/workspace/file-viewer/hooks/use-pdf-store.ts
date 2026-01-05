import { create } from "zustand";

interface PdfViewerStore {
  currentPage: number;
  totalPages: number;

  setTotalPages: (pages: number) => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const usePdfStore = create<PdfViewerStore>((set, get) => ({
  currentPage: 1,
  totalPages: 1,

  setTotalPages: (pages) => set({ totalPages: pages }),

  setPage: (page) => {
    const { totalPages } = get();
    set({ currentPage: Math.min(Math.max(page, 1), totalPages) });
  },

  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
    }
  },
}));
