import { useEffect, useRef } from "react";

export type KeyCode = string;

interface KeyboardShortcut {
  id: string;
  key: KeyCode;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  action: () => void;
  preventDefault?: boolean;
  once?: boolean;
  enabled?: boolean;
  disableOnInputs?: boolean;
}

export const useKeyboardShortcuts = (
  shortcuts: KeyboardShortcut[],
  options?: {
    enabled?: boolean;
    target?: Window | HTMLElement;
    disableOnInputs?: boolean; // New prop
    ignoredElementSelectors?: string[]; // New prop for specific IDs/Classes
  }
) => {
  const firedRef = useRef<Set<string>>(new Set());

  // Set default to true so it doesn't break typing by default
  const {
    enabled = true,
    target: targetOption = window,
    disableOnInputs = true,
    ignoredElementSelectors = [],
  } = options ?? {};

  useEffect(() => {
    if (!enabled) return;

    const target = targetOption;

    const onKeyDown: EventListener = (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      const e = event;

      // 1. Check if we should ignore based on focus
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;
      if (disableOnInputs && isInput) return;

      // 2. Check for specific IDs or Classnames
      if (ignoredElementSelectors.length > 0) {
        const isIgnored = ignoredElementSelectors.some((selector) =>
          activeElement?.matches(selector)
        );
        if (isIgnored) return;
      }

      for (const sc of shortcuts) {
        if (sc.enabled === false) continue;

        if (e.code !== sc.key) continue;
        if (sc.shift && !e.shiftKey) continue;
        if (sc.ctrl) {
          const isMac = navigator.platform.toUpperCase().includes("MAC");
          const primaryMod = isMac ? e.metaKey : e.ctrlKey;
          if (!primaryMod) continue;
        }

        if (sc.alt && !e.altKey) continue;

        const shouldDisableOnInputs = sc.disableOnInputs ?? disableOnInputs;

        if (shouldDisableOnInputs && isInput) continue;

        if (sc.once && firedRef.current.has(sc.id)) return;

        if (sc.preventDefault) e.preventDefault();

        firedRef.current.add(sc.id);
        sc.action();
      }
    };

    // ... onKeyUp remains the same ...
    const onKeyUp: EventListener = (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      const e = event;
      shortcuts.forEach((sc) => {
        if (e.code === sc.key) firedRef.current.delete(sc.id);
      });
    };

    target.addEventListener("keydown", onKeyDown);
    target.addEventListener("keyup", onKeyUp);

    return () => {
      target.removeEventListener("keydown", onKeyDown);
      target.removeEventListener("keyup", onKeyUp);
      firedRef.current.clear();
    };
  }, [
    shortcuts,
    enabled,
    targetOption,
    disableOnInputs,
    ignoredElementSelectors,
  ]);
};
