import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-events";
import { RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect } from "react";
import useAnnotationStore from "../hooks/use-annotation-store";
import { useKanvasStore } from "../hooks/use-kanvas-controller";
import { CanvasHelp } from "./CanvasHelp";
import PdfToolbar from "./PdfToolbar";

interface KanvasToolbarProps {
  isPDF?: boolean;
}

export const KanvasToolbar = ({ isPDF }: KanvasToolbarProps) => {
  const zoomIn = useKanvasStore((s) => s.zoomIn);
  const zoomOut = useKanvasStore((s) => s.zoomOut);
  const viewScale = useKanvasStore((s) => s.viewScale);
  const viewOffset = useKanvasStore((s) => s.viewOffset);
  const resetView = useKanvasStore((s) => s.resetView);

  const { undo } = useAnnotationStore();
  const canUndo = useAnnotationStore((s) => s.undoStack.length > 0);

  const canReset = viewScale !== 1 || viewOffset.x !== 0 || viewOffset.y !== 0;

  useKeyboardShortcuts([
    {
      id: "reset",
      key: "KeyR",
      shift: true,
      once: true,
      preventDefault: true,
      action: resetView,
      enabled: canReset,
    },
    {
      id: "undo",
      key: "KeyZ",
      preventDefault: true,
      action: undo,
      enabled: canUndo,
      ctrl: true,
    },
  ]);

  useEffect(() => {
    return () => resetView();
  }, [resetView]);

  return (
    <div className="shrink-0 border-t p-1">
      <div className="flex items-center gap-2">
        {/* LEFT */}
        <CanvasHelp />

        {/* CENTER (PDF only) */}
        <div className="flex-1 flex justify-center">
          {isPDF && <PdfToolbar />}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Button
            title="Zoom Out"
            variant="ghost"
            size="icon"
            onClick={zoomOut}>
            <ZoomOut size={18} />
          </Button>

          <Kbd>{Math.round(viewScale * 100)}%</Kbd>

          <Button title="Zoom In" variant="ghost" size="icon" onClick={zoomIn}>
            <ZoomIn size={18} />
          </Button>

          <Separator orientation="vertical" className="h-6!" />

          <Button
            title="Reset View"
            variant="ghost"
            size="icon"
            onClick={resetView}>
            <RefreshCw size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
