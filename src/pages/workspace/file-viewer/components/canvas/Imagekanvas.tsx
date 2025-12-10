// image/ImageKanvas.tsx

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Circle, Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { useKanvasStore } from "../../hooks/use-kanvas-controller";

export interface ImageKanvasProps {
  imageUrl: string;
  disabled?: boolean;
}

const ImageKanvas: React.FC<ImageKanvasProps> = ({ imageUrl, disabled }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null);
  const viewportRef = useRef<any>(null);
  const imageNodeRef = useRef<any>(null);

  const [img] = useImage(imageUrl, "anonymous");

  const viewScale = useKanvasStore((s) => s.viewScale);
  const viewOffset = useKanvasStore((s) => s.viewOffset);
  const activeTool = useKanvasStore((s) => s.activeTool);
  const draftPin = useKanvasStore((s) => s.draftPin);
  const setNaturalSize = useKanvasStore((s) => s.setNaturalSize);
  const zoomAtPoint = useKanvasStore((s) => s.zoomAtPoint);
  const setDraftPin = useKanvasStore((s) => s.setDraftPin);
  const pan = useKanvasStore((s) => s.pan);

  const [naturalSize, setNaturalSizeLocal] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });

  const [display, setDisplay] = useState<{
    scale: number;
    x: number;
    y: number;
  } | null>(null);

  const isPanning = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!img) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    setNaturalSizeLocal({ w, h });
    setNaturalSize(w, h);
  }, [img]);

  useEffect(() => {
    if (!containerRef.current || !naturalSize) return;

    const compute = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const cw = rect.width;
      const ch = rect.height;

      const containScale = Math.min(cw / naturalSize.w, ch / naturalSize.h);

      const dw = naturalSize.w * containScale;
      const dh = naturalSize.h * containScale;

      setStageSize({ w: cw, h: ch });

      setDisplay({
        scale: containScale,
        x: (cw - dw) / 2,
        y: (ch - dh) / 2,
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(containerRef.current);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [naturalSize]);

  // -------------------------------
  // Convert Stage → Image coords
  // -------------------------------
  const stageToImageCoords = useCallback(
    (p: { x: number; y: number } | null) => {
      if (!p || !display || !naturalSize) return null;

      const vx = (p.x - viewOffset.x) / viewScale;
      const vy = (p.y - viewOffset.y) / viewScale;

      const ix = (vx - display.x) / display.scale;
      const iy = (vy - display.y) / display.scale;

      return { x: ix, y: iy };
    },
    [display, naturalSize, viewOffset, viewScale]
  );

  const imageToViewportCoords = useCallback(
    (p: { x: number; y: number } | null) => {
      if (!p || !display) return null;

      return {
        x: display.x + p.x * display.scale,
        y: display.y + p.y * display.scale,
      };
    },
    [display]
  );

  const isAnnotating = activeTool !== "none";

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{ minHeight: 0 }}>
      <Stage
        ref={stageRef}
        width={stageSize.w}
        height={stageSize.h}
        onClick={() => {
          if (activeTool !== "pin") return;

          const pos = stageRef.current.getPointerPosition();
          const imgPos = stageToImageCoords(pos);

          if (!imgPos) return;

          // create draft pin (image space)
          setDraftPin(imgPos);

          // OPTIONAL (recommended UX)
          // auto switch to select mode after placing pin
          // setTool("none");
        }}
        // ---------- WHEEL ZOOM ----------
        onWheel={(e) => {
          // 🚫 Block normal wheel
          if (!e.evt.ctrlKey || isAnnotating) return;

          e.evt.preventDefault();

          const pointer = stageRef.current.getPointerPosition();
          if (!pointer) return;

          zoomAtPoint(pointer, e.evt.deltaY);
        }}
        // ---------- PAN ----------
        onMouseDown={(e) => {
          if (isAnnotating) return;

          isPanning.current = true;
          lastPos.current = stageRef.current.getPointerPosition();
        }}
        onMouseMove={() => {
          if (isAnnotating) return;

          if (!isPanning.current || !lastPos.current) return;

          const pos = stageRef.current.getPointerPosition();
          const dx = pos.x - lastPos.current.x;
          const dy = pos.y - lastPos.current.y;

          pan(dx, dy);
          lastPos.current = pos;
        }}
        onMouseUp={() => {
          isPanning.current = false;
          lastPos.current = null;
        }}>
        <Layer
          ref={viewportRef}
          x={viewOffset.x}
          y={viewOffset.y}
          scaleX={viewScale}
          scaleY={viewScale}>
          {img && display && (
            <KonvaImage
              ref={imageNodeRef}
              image={img}
              width={naturalSize!.w}
              height={naturalSize!.h}
              x={display.x}
              y={display.y}
              scaleX={display.scale}
              scaleY={display.scale}
            />
          )}
          {draftPin &&
            (() => {
              const p = imageToViewportCoords(draftPin);
              if (!p) return null;

              return <Circle x={p.x} y={p.y} radius={6} fill="red" />;
            })()}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageKanvas;
