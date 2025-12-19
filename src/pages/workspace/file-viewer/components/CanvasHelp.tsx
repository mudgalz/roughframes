import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

interface Shortcut {
  id: string;
  keys: React.ReactNode;
  description: string;
}

import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

const SHORTCUTS: Shortcut[] = [
  {
    id: "zoom-wheel",
    keys: <Kbd>Wheel</Kbd>,
    description: "Zoom in / out",
  },
  {
    id: "zoom-pinch",
    keys: <Kbd>Pinch</Kbd>,
    description: "Zoom on trackpad",
  },
  {
    id: "pan",
    keys: (
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span className="text-sm">+</span>
        <Kbd>Drag</Kbd>
      </KbdGroup>
    ),
    description: "Pan canvas",
  },
  {
    id: "draw",
    keys: (
      <KbdGroup>
        <Kbd>Click</Kbd>
        <span className="text-sm">+</span>
        <Kbd>Drag</Kbd>
      </KbdGroup>
    ),
    description: "Draw annotation",
  },
  {
    id: "reset",
    keys: (
      <KbdGroup>
        <Kbd>Shift</Kbd>
        <span className="text-sm">+</span>
        <Kbd>R</Kbd>
      </KbdGroup>
    ),
    description: "Reset View",
  },
  {
    id: "undo",
    keys: (
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span className="text-sm">+</span>
        <Kbd>Z</Kbd>
      </KbdGroup>
    ),
    description: "Undo last action (Shapes)",
  },
  {
    id: "redo",
    keys: (
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <span className="text-sm">+</span>
        <Kbd>Y</Kbd>
      </KbdGroup>
    ),
    description: "Redo last action (Shapes)",
  },
];

export const CanvasHelp: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"icon"} aria-label="Help" variant={"ghost"}>
          <HelpCircle size={18} />
        </Button>
      </PopoverTrigger>

      <PopoverContent side="right" align="end" className="w-72 p-4">
        <h4 className="mb-3 font-medium text-sm">Canvas shortcuts</h4>

        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">{s.keys}</div>
              <span className="text-sm text-muted-foreground">
                {s.description}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
