import { useEffect, useState } from "react";

export interface Size {
  width: number;
  height: number;
}

export default function useResizeObserver<T extends HTMLElement>() {
  const [ref, setRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return { ref: setRef, size };
}
