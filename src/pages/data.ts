import {
  FileText,
  Film,
  Layers,
  MousePointerClick,
  Pencil,
  Square,
} from "lucide-react";

const featuresList = [
  {
    icon: Pencil,
    title: "Freehand Drawing & Sketching",
    description:
      "Draw naturally on images and PDFs with smooth freehand tools designed for quick ideas and rough visual feedback.",
  },
  {
    icon: Square,
    title: "Precise Shape Annotations",
    description:
      "Highlight areas using rectangles, circles, arrows, and guides to communicate clearly and reduce back-and-forth.",
  },
  {
    icon: MousePointerClick,
    title: "Pixel-Accurate Marking",
    description:
      "Zoom, pan, and annotate with precision. Every mark stays locked to the exact spot, even at different scales.",
  },
  {
    icon: FileText,
    title: "Image & PDF Support",
    description:
      "Annotate images and multi-page PDFs seamlessly without converting files or losing quality.",
  },
  {
    icon: Layers,
    title: "Non-Destructive Annotations",
    description:
      "All annotations live on separate layers, so your original files remain untouched and easy to export or revise.",
  },
  {
    icon: Film,
    title: "Video Frame Annotation (Coming Soon)",
    description:
      "Review and annotate individual video frames and timestamps — perfect for design reviews and motion feedback.",
  },
];

export { featuresList };
