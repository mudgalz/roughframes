import type Konva from "konva";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Ellipse,
  Image as KonvaImage,
  Layer,
  Line,
  Rect,
  Stage,
} from "react-konva";
import useImage from "use-image";

import useResizeObserver from "@/hooks/use-resize-observer";
import useAnnotationStore from "../../hooks/use-annotation-store";
import { useKanvasStore } from "../../hooks/use-kanvas-controller";
import type { Annotation, Point } from "../../types";
import { isEnoughDrawn, simplifyRDP } from "./utils";

export interface ImageKanvasProps {
  imageUrl: string;
  width: number;
  height: number;
  annotations: Annotation[];
}

const ImageKanvas: React.FC<ImageKanvasProps> = ({
  imageUrl,
  width,
  height,
  annotations,
}) => {
  const stageRef = useRef<Konva.Stage | null>(null);

  // live shape & positions
  const rectRef = useRef<Konva.Rect | null>(null);
  const ellipseRef = useRef<Konva.Ellipse | null>(null);
  const lineRef = useRef<Konva.Line | null>(null);
  const liveRef = useRef<Annotation | null>(null);
  const rawPointsRef = useRef<Point[]>([]);
  const liveLayerRef = useRef<Konva.Layer | null>(null);

  // panning
  const isPanning = useRef(false);
  const lastPos = useRef<Point | null>(null);

  const [img] = useImage(imageUrl, "anonymous");

  const { activeShape, activeColor, commitLiveAnnotation } =
    useAnnotationStore();
  const { viewScale, viewOffset, pan, zoomAtPoint } = useKanvasStore();

  const naturalSize = useMemo(() => ({ w: width, h: height }), [width, height]);
  const { ref: containerRef, size } = useResizeObserver<HTMLDivElement>();

  const stageSize = useMemo(() => ({ w: size.width, h: size.height }), [size]);

  const display = useMemo(() => {
    if (!stageSize.w || !stageSize.h) return null;

    const scale = Math.min(
      stageSize.w / naturalSize.w,
      stageSize.h / naturalSize.h
    );

    return {
      scale,
      x: (stageSize.w - naturalSize.w * scale) / 2,
      y: (stageSize.h - naturalSize.h * scale) / 2,
    };
  }, [stageSize, naturalSize]);

  const stageToImage = useCallback(
    (p: Point): Point | null => {
      if (!display) return null;

      const vx = (p.x - viewOffset.x) / viewScale;
      const vy = (p.y - viewOffset.y) / viewScale;

      const ix = (vx - display.x) / display.scale;
      const iy = (vy - display.y) / display.scale;

      if (ix < 0 || iy < 0 || ix > width || iy > height) return null;
      return { x: ix, y: iy };
    },
    [display, viewOffset, viewScale, width, height]
  );

  const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;

    const shouldPan = e.evt.ctrlKey || activeShape === "none";

    if (shouldPan) {
      isPanning.current = true;
      lastPos.current = pos;
      return;
    }

    const imgPos = stageToImage(pos);
    if (!imgPos) return;

    const base = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      color: activeColor,
    };

    if (activeShape === "rect" || activeShape === "circle") {
      liveRef.current = {
        ...base,
        shape: activeShape,
        start: imgPos,
        end: imgPos,
      };
    }

    if (activeShape === "freehand") {
      rawPointsRef.current = [];

      liveRef.current = {
        ...base,
        shape: "freehand",
        points: [],
      };
    }
  };

  const handlePointerMove = () => {
    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;

    if (isPanning.current && lastPos.current) {
      pan(pos.x - lastPos.current.x, pos.y - lastPos.current.y);
      lastPos.current = pos;
      return;
    }

    if (!liveRef.current || !display) return;
    const imgPos = stageToImage(pos);
    if (!imgPos || !liveRef.current) return;

    // RECT / CIRCLE
    if (
      liveRef.current.shape === "rect" ||
      liveRef.current.shape === "circle"
    ) {
      liveRef.current.end = imgPos;

      const x1 = Math.min(liveRef.current.start.x, imgPos.x);
      const y1 = Math.min(liveRef.current.start.y, imgPos.y);
      const x2 = Math.max(liveRef.current.start.x, imgPos.x);
      const y2 = Math.max(liveRef.current.start.y, imgPos.y);

      const vx = display.x + x1 * display.scale;
      const vy = display.y + y1 * display.scale;
      const vw = (x2 - x1) * display.scale;
      const vh = (y2 - y1) * display.scale;

      if (liveRef.current.shape === "rect") {
        rectRef.current?.setAttrs({ x: vx, y: vy, width: vw, height: vh });
      } else {
        ellipseRef.current?.setAttrs({
          x: vx + vw / 2,
          y: vy + vh / 2,
          radiusX: vw / 2,
          radiusY: vh / 2,
        });
      }
    }

    // FREEHAND
    if (liveRef.current.shape === "freehand") {
      const vx = display.x + imgPos.x * display.scale;
      const vy = display.y + imgPos.y * display.scale;

      rawPointsRef.current.push({ x: vx, y: vy });

      if (rawPointsRef.current.length < 3) return;

      const p1 = rawPointsRef.current.at(-2)!;
      const p2 = rawPointsRef.current.at(-1)!;

      const cx = (p1.x + p2.x) / 2;
      const cy = (p1.y + p2.y) / 2;

      liveRef.current.points.push({ x: cx, y: cy });
      lineRef.current?.points(
        liveRef.current.points.flatMap((p) => [p.x, p.y])
      );
    }

    liveLayerRef.current?.draw();
  };

  const handlePointerUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      lastPos.current = null;
      return;
    }

    if (!liveRef.current || !display) return;

    if (liveRef.current.shape === "freehand") {
      const simplified = simplifyRDP(rawPointsRef.current, 1.2);

      liveRef.current.points = simplified.map((p) => ({
        x: (p.x - display.x) / display.scale,
        y: (p.y - display.y) / display.scale,
      }));

      rawPointsRef.current = [];
    }

    if (!isEnoughDrawn(liveRef.current)) {
      cleanup();
      return;
    }

    commitLiveAnnotation(liveRef.current);
    cleanup();
  };

  const cleanup = () => {
    liveRef.current = null;
    rawPointsRef.current = [];

    rectRef.current?.setAttrs({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });

    ellipseRef.current?.setAttrs({
      x: 0,
      y: 0,
      radiusX: 0,
      radiusY: 0,
    });

    lineRef.current?.points([]);

    liveLayerRef.current?.draw();
  };
  const viewport = {
    x: viewOffset.x,
    y: viewOffset.y,
    scaleX: viewScale,
    scaleY: viewScale,
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden">
      <Stage
        ref={stageRef}
        width={stageSize.w}
        height={stageSize.h}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onWheel={(e) => {
          e.evt.preventDefault();
          const p = stageRef.current?.getPointerPosition();
          if (p) zoomAtPoint(p, e.evt.deltaY);
        }}>
        <Layer {...viewport}>
          {img && display && (
            <KonvaImage
              image={img}
              x={display.x}
              y={display.y}
              scaleX={display.scale}
              scaleY={display.scale}
              width={width}
              height={height}
            />
          )}
        </Layer>

        {/* Live Drawing */}
        <Layer ref={liveLayerRef} {...viewport} listening={false}>
          <Rect
            strokeWidth={2}
            strokeScaleEnabled={false}
            ref={rectRef}
            stroke={activeColor}
          />
          <Ellipse
            ref={ellipseRef}
            stroke={activeColor}
            radiusX={0}
            radiusY={0}
            strokeWidth={2}
            strokeScaleEnabled={false}
          />
          <Line
            ref={lineRef}
            stroke={activeColor}
            lineCap="round"
            lineJoin="round"
            strokeWidth={2}
            strokeScaleEnabled={false}
          />
        </Layer>

        {/* Saved Annotations */}
        <Layer {...viewport}>
          {display &&
            annotations.map((a) => {
              // RECT / CIRCLE
              if (a.shape === "rect" || a.shape === "circle") {
                const x1 = Math.min(a.start.x, a.end.x);
                const y1 = Math.min(a.start.y, a.end.y);
                const x2 = Math.max(a.start.x, a.end.x);
                const y2 = Math.max(a.start.y, a.end.y);

                const vx = display.x + x1 * display.scale;
                const vy = display.y + y1 * display.scale;
                const vw = (x2 - x1) * display.scale;
                const vh = (y2 - y1) * display.scale;

                if (a.shape === "rect") {
                  return (
                    <Rect
                      key={a.id}
                      x={vx}
                      y={vy}
                      width={vw}
                      height={vh}
                      stroke={a.color}
                      strokeWidth={2}
                      strokeScaleEnabled={false}
                    />
                  );
                }

                // CIRCLE / ELLIPSE
                return (
                  <Ellipse
                    key={a.id}
                    x={vx + vw / 2}
                    y={vy + vh / 2}
                    radiusX={vw / 2}
                    radiusY={vh / 2}
                    stroke={a.color}
                    strokeWidth={2}
                    strokeScaleEnabled={false}
                  />
                );
              }

              // FREEHAND
              if (a.shape === "freehand") {
                const points = a.points.flatMap((p) => [
                  display.x + p.x * display.scale,
                  display.y + p.y * display.scale,
                ]);

                return (
                  <Line
                    key={a.id}
                    points={points}
                    stroke={a.color}
                    strokeWidth={2}
                    lineCap="round"
                    lineJoin="round"
                    strokeScaleEnabled={false}
                  />
                );
              }

              return null;
            })}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageKanvas;
