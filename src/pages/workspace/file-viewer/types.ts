type Tool = "none" | "pin" | "rect" | "freehand";
type Point = { x: number; y: number };
interface BaseAnnotation {
  id: string;
  tool: Tool;
  created_at: string;
}
interface PinAnnotation extends BaseAnnotation {
  tool: "pin";
  position: Point;
}
interface RectAnnotation extends BaseAnnotation {
  tool: "rect";
  position: Point;
  size: {
    width: number;
    height: number;
  };
}
interface FreehandAnnotation extends BaseAnnotation {
  tool: "freehand";
  points: Array<Point>;
}
type Annotation = PinAnnotation | RectAnnotation | FreehandAnnotation;

export type {
  Annotation,
  BaseAnnotation,
  FreehandAnnotation,
  PinAnnotation,
  Point,
  RectAnnotation,
  Tool,
};
