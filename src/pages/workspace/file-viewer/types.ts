export type Shape = "none" | "rect" | "circle" | "freehand" | "arrow";

export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  id: string;
  shape: Shape;
  created_at: string;
  color: string;
}

/**
 * Rect & Circle are defined by two points
 */
export interface BoxAnnotation extends BaseAnnotation {
  shape: "rect" | "circle" | "arrow";
  start: Point; // image space
  end: Point; // image space
}

/**
 * Freehand uses reduced image-space points
 */
export interface FreehandAnnotation extends BaseAnnotation {
  shape: "freehand";
  points: Point[];
}

export type Annotation = BoxAnnotation | FreehandAnnotation;
