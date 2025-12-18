// image/ImageKanvas.tsx
import { useShallow } from "zustand/shallow";

import useResizeObserver from "@/hooks/use-resize-observer";
import type Konva from "konva";
import React, { useCallback, useMemo, useRef } from "react";
import { Circle, Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";
import { useAnnotationStore } from "../../hooks/use-annotation";
import { useFeedbackDraftStore } from "../../hooks/use-feedback-draft";
import { useKanvasStore } from "../../hooks/use-kanvas-controller";
import type { Point } from "../../types";

export interface ImageKanvasProps {
  imageUrl: string;
  disabled?: boolean;
  width: number;
  height: number;
}

const ImageKanvas: React.FC<ImageKanvasProps> = ({
  imageUrl,
  width,
  height,
}) => {
  const stageRef = useRef<Konva.Stage | null>(null);
  const viewportRef = useRef<Konva.Layer | null>(null);
  const imageNodeRef = useRef<Konva.Image | null>(null);

  const [img] = useImage(imageUrl, "anonymous");

  const { mode, isOpen, startNew, activeFeedback } = useFeedbackDraftStore(
    useShallow((s) => ({
      mode: s.mode,
      isOpen: s.isOpen,
      startNew: s.startNew,
      activeFeedback: s.activeFeedback,
    }))
  );
  const { annotations, addAnnotation, activeTool, updateAnnotation } =
    useAnnotationStore(
      useShallow((s) => ({
        annotations: s.annotations,
        addAnnotation: s.addAnnotation,
        updateAnnotation: s.updateAnnotation,
        activeTool: s.activeTool,
      }))
    );

  const viewScale = useKanvasStore((s) => s.viewScale);
  const viewOffset = useKanvasStore((s) => s.viewOffset);
  const zoomAtPoint = useKanvasStore((s) => s.zoomAtPoint);

  const pan = useKanvasStore((s) => s.pan);
  const naturalSize = useMemo(() => ({ w: width, h: height }), [width, height]);
  const { ref: containerRef, size } = useResizeObserver<HTMLDivElement>();

  const stageSize = useMemo(() => ({ w: size.width, h: size.height }), [size]);
  const isPanning = useRef(false);
  const lastPos = useRef<Point | null>(null);

  const display = useMemo(() => {
    if (!stageSize.w || !stageSize.h) return null;

    const scale = Math.min(
      stageSize.w / naturalSize.w,
      stageSize.h / naturalSize.h
    );

    const dw = naturalSize.w * scale;
    const dh = naturalSize.h * scale;

    return {
      scale,
      x: (stageSize.w - dw) / 2,
      y: (stageSize.h - dh) / 2,
    };
  }, [stageSize, naturalSize]);

  const stageToImageCoords = useCallback(
    (p: Point | null): Point | null => {
      if (!p || !display) return null;

      const vx = (p.x - viewOffset.x) / viewScale;
      const vy = (p.y - viewOffset.y) / viewScale;

      const ix = (vx - display.x) / display.scale;
      const iy = (vy - display.y) / display.scale;

      // ✅ BLOCK clicks outside image
      if (ix < 0 || iy < 0 || ix > naturalSize.w || iy > naturalSize.h) {
        return null;
      }

      return { x: ix, y: iy };
    },
    [display, naturalSize, viewOffset, viewScale]
  );

  const imageToViewportCoords = useCallback(
    (p: Point | null) => {
      if (!p || !display) return null;

      return {
        x: display.x + p.x * display.scale,
        y: display.y + p.y * display.scale,
      };
    },
    [display]
  );

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = stageRef.current;
      if (!stage) return;

      const pos = stage.getPointerPosition();
      if (!pos) return;

      // ✅ Ctrl + drag → PAN
      if (e.evt.ctrlKey) {
        isPanning.current = true;
        lastPos.current = pos;
        return;
      }

      const imgPos = stageToImageCoords(pos);
      if (!imgPos) return;

      // ✅ Only act if pin tool is active
      if (activeTool !== "pin") return;

      // ✅ Ensure feedback draft is open
      if (!isOpen) {
        startNew("single");
      }

      // ✅ SINGLE mode → move existing pin instead of adding
      if (mode === "single") {
        const existingPin = annotations.find((a) => a.tool === "pin");

        if (existingPin) {
          updateAnnotation(existingPin.id, "pin", {
            position: imgPos,
          });
          return;
        }
      }

      // ✅ MULTIPLE mode OR first pin
      addAnnotation({
        id: crypto.randomUUID(),
        tool: "pin",
        position: imgPos,
        created_at: new Date().toISOString(),
      });
    },
    [
      activeTool,
      annotations,
      stageToImageCoords,
      isOpen,
      mode,
      startNew,
      addAnnotation,
      updateAnnotation,
    ]
  );

  const handlePointerMove = useCallback(() => {
    if (!isPanning.current || !lastPos.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    pan(pos.x - lastPos.current.x, pos.y - lastPos.current.y);
    lastPos.current = pos;
  }, [pan]);

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
    lastPos.current = null;

    // later: finalize rect / freehand
  }, []);

  const activeAnnotations = activeFeedback?.annotations
    ? activeFeedback?.annotations
    : annotations;

  const uiScale = Math.pow(viewScale, 0.5);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      style={{ minHeight: 0 }}>
      <Stage
        ref={stageRef}
        width={stageSize.w}
        height={stageSize.h}
        onWheel={(e) => {
          if (!e.evt.ctrlKey) return;
          e.evt.preventDefault();

          const stage = stageRef.current;
          if (!stage) return;

          const pointer = stage.getPointerPosition();
          if (!pointer) return;

          zoomAtPoint(pointer, e.evt.deltaY);
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}>
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
          {activeAnnotations.map((a) => {
            if (a.tool !== "pin") return null;

            const p = imageToViewportCoords(a.position);
            if (!p) return null;

            return (
              <Circle
                key={a.id}
                x={p.x}
                y={p.y}
                radius={5 / uiScale}
                stroke="#ef4444"
                strokeWidth={1.5 / uiScale}
                shadowBlur={2 / uiScale}
                shadowColor="black"
                shadowOpacity={0.15}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageKanvas;
