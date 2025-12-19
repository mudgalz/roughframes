import type { Annotation, Point } from "../../types";

export function simplifyRDP(points: Point[], epsilon = 1.2): Point[] {
  if (points.length < 3) return points;

  let dmax = 0;
  let index = 0;

  const start = points[0];
  const end = points.at(-1)!;

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > dmax) {
      dmax = d;
      index = i;
    }
  }

  if (dmax > epsilon) {
    const left = simplifyRDP(points.slice(0, index + 1), epsilon);
    const right = simplifyRDP(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  }

  return [start, end];
}

function perpendicularDistance(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (dx === 0 && dy === 0) {
    return Math.hypot(p.x - a.x, p.y - a.y);
  }

  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);

  const px = a.x + t * dx;
  const py = a.y + t * dy;

  return Math.hypot(p.x - px, p.y - py);
}

/**
 * Returns true only if the drawn shape is meaningful enough to save
 * All checks are done in IMAGE SPACE
 */
export function isEnoughDrawn(
  annotation: Annotation,
  opts?: {
    minBoxSize?: number; // rect / circle diagonal
    minStrokeLength?: number; // freehand total length
  }
): boolean {
  const minBox = opts?.minBoxSize ?? 2;
  const minStroke = opts?.minStrokeLength ?? 4;

  // RECT / CIRCLE
  if (annotation.shape === "rect" || annotation.shape === "circle") {
    const dx = annotation.end.x - annotation.start.x;
    const dy = annotation.end.y - annotation.start.y;
    return Math.hypot(dx, dy) >= minBox;
  }

  // FREEHAND
  if (annotation.shape === "freehand") {
    const pts = annotation.points;
    if (pts.length < 2) return false;

    let len = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x;
      const dy = pts[i].y - pts[i - 1].y;
      len += Math.hypot(dx, dy);
    }

    return len >= minStroke;
  }

  return false;
}
