import { Ellipse, Line, Rect } from "react-konva";
import type { Annotation } from "../../types";

export default function KonvaShapes({
  annotation,
  uiScale,
}: {
  annotation: Annotation;
  uiScale: number;
}) {
  if (annotation.shape === "rect") {
    const { position, size } = annotation;
    return (
      <Rect
        x={size.width < 0 ? position.x + size.width : position.x}
        y={size.height < 0 ? position.y + size.height : position.y}
        width={Math.abs(size.width)}
        height={Math.abs(size.height)}
        stroke={annotation.color}
        strokeWidth={2 / uiScale}
      />
    );
  }

  if (annotation.shape === "circle") {
    const { position, size } = annotation;
    return (
      <Ellipse
        x={position.x + size.width / 2}
        y={position.y + size.height / 2}
        radiusX={Math.abs(size.width) / 2}
        radiusY={Math.abs(size.height) / 2}
        stroke={annotation.color}
        strokeWidth={2 / uiScale}
      />
    );
  }

  if (annotation.shape === "freehand") {
    return (
      <Line
        points={annotation.points.flatMap((p) => [p.x, p.y])}
        stroke={annotation.color}
        strokeWidth={2 / uiScale}
        lineCap="round"
        lineJoin="round"
      />
    );
  }

  return null;
}
