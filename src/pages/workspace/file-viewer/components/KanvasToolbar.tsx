import { Button } from "@/components/ui/button";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-events";
import { RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import useAnnotationStore from "../hooks/use-annotation-store";
import { useKanvasStore } from "../hooks/use-kanvas-controller";
import { CanvasHelp } from "./CanvasHelp";

export const KanvasToolbar = () => {
  const zoomIn = useKanvasStore((s) => s.zoomIn);
  const zoomOut = useKanvasStore((s) => s.zoomOut);
  const viewScale = useKanvasStore((s) => s.viewScale);
  const resetView = useKanvasStore((s) => s.resetView);
  const { undo } = useAnnotationStore();
  const canUndo = useAnnotationStore((s) => s.undoStack.length > 0);

  useKeyboardShortcuts([
    {
      id: "reset",
      key: "KeyR",
      shift: true,
      once: true,
      preventDefault: true,
      action: resetView,
      enabled: viewScale !== 1,
    },
    {
      id: "undo",
      key: "KeyZ",
      preventDefault: true,
      action: undo,
      enabled: canUndo,
      ctrl: true,
      meta: true,
    },
  ]);

  return (
    <div className="flex h-full flex-col items-center gap-2 pr-2">
      {/* Push rest to bottom */}
      <div className="flex flex-col items-center gap-2 mb-auto">
        <Button title="Zoom In" variant="outline" size="icon" onClick={zoomIn}>
          <ZoomIn size={18} />
        </Button>

        <Button
          title="Zoom Out"
          variant="outline"
          size="icon"
          onClick={zoomOut}>
          <ZoomOut size={18} />
        </Button>

        <Button
          title="Reset View"
          variant="outline"
          size="icon"
          onClick={resetView}>
          <RefreshCw size={18} />
        </Button>
      </div>
      <CanvasHelp />
    </div>
  );
};
