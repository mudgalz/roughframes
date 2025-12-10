import { create } from "zustand";

export interface ConfirmOptions {
  title: string;
  description?: string;
  okLabel?: string;
  cancelLabel?: string;
  className?: string;
  prompt?: string;
}
interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions | null;

  resolve: ((value: boolean | string) => void) | null;

  open: (options: ConfirmOptions) => Promise<boolean | string>;
  close: (value: boolean | string) => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  options: null,
  resolve: null,

  open: (options) => {
    return new Promise<boolean | string>((resolve) => {
      set({ isOpen: true, options, resolve });
    });
  },

  close: (value) => {
    set((s) => {
      s.resolve?.(value);
      return { ...s, isOpen: false, resolve: null };
    });
  },
}));

export function confirm(options: ConfirmOptions) {
  return useConfirmStore.getState().open(options);
}
