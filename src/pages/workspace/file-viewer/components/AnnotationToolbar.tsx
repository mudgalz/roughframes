import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  MousePointer,
  Pin,
  RefreshCw,
  Square,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useAnnotationStore } from "../hooks/use-annotation";
import { useKanvasStore } from "../hooks/use-kanvas-controller";
import type { Tool } from "../types";

export const AnnotationToolbar = () => {
  const activeTool = useAnnotationStore((s) => s.activeTool);
  const setTool = useAnnotationStore((s) => s.setTool);

  const zoomIn = useKanvasStore((s) => s.zoomIn);
  const zoomOut = useKanvasStore((s) => s.zoomOut);
  const resetView = useKanvasStore((s) => s.resetView);

  return (
    <div className="flex items-center gap-2 w-max">
      {/* Tools */}
      <ToggleGroup
        type="single"
        value={activeTool}
        variant={"outline"}
        onValueChange={(value) => {
          if (!value) return;
          setTool(value as Tool);
        }}
        className="">
        <ToggleGroupItem title="Select" value="none" aria-label="Select">
          <MousePointer size={18} />
        </ToggleGroupItem>

        <ToggleGroupItem title="Pin" value="pin" aria-label="Pin">
          <Pin size={18} />
        </ToggleGroupItem>

        <ToggleGroupItem title="Rectangle" value="rect" aria-label="Rectangle">
          <Square size={18} />
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Zoom Controls */}
      <Button variant="outline" size="icon" onClick={zoomOut}>
        <ZoomOut size={18} />
      </Button>

      <Button variant="outline" size="icon" onClick={zoomIn}>
        <ZoomIn size={18} />
      </Button>

      <Button
        title="Reset Zoom"
        variant="outline"
        size="icon"
        onClick={resetView}>
        <RefreshCw size={18} />
      </Button>
    </div>
  );
};
