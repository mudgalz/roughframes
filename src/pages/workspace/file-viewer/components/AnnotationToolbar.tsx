import {
  ArrowUpRight,
  Check,
  Circle,
  LineSquiggle,
  Pencil,
  Square,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import useAnnotationStore from "../hooks/use-annotation-store";
import type { Shape } from "../types";

interface ToolOption {
  value: Shape;
  label: string;
  icon: React.ReactNode;
}

const TOOL_OPTIONS: ToolOption[] = [
  { value: "rect", label: "Rectangle", icon: <Square size={14} /> },
  { value: "freehand", label: "Freehand", icon: <Pencil size={14} /> },
  { value: "circle", label: "Circle", icon: <Circle size={14} /> },
  { value: "arrow", label: "Arrow", icon: <ArrowUpRight size={14} /> },
];

const COLORS: string[] = [
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ffd700",
];

export default function AnnotationToolbar() {
  const { annotations, activeColor, setColor, setShape, activeShape } =
    useAnnotationStore();

  const hasAnnotations = annotations.length > 0;

  return (
    <div className="flex ">
      <Popover>
        <PopoverTrigger tabIndex={-1} title="Annotation Tools">
          <Button
            asChild
            className={`${
              hasAnnotations &&
              "dark:border-indigo-600 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/30"
            }`}
            size={"icon"}
            variant={"outline"}>
            <span className="flex h-9 w-9 items-center justify-center">
              <LineSquiggle
                className={cn("size-4", hasAnnotations && "stroke-indigo-500")}
              />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div>
            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-1">Shape</p>
              <ToggleGroup
                size={"lg"}
                type="single"
                value={activeShape}
                onValueChange={(value) => {
                  if (!value) return;
                  setShape(value as Shape);
                }}
                className="flex gap-1">
                {TOOL_OPTIONS.map((tool) => (
                  <ToggleGroupItem
                    title={tool.label}
                    key={tool.value}
                    value={tool.value}
                    aria-label={tool.label}
                    className="border data-[state=on]:bg-indigo-950 data-[state=on]:text-indigo-50 data-[state=on]:border-indigo-500 hover:bg-indigo-700/20">
                    {tool.icon}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Color</p>

              <ToggleGroup
                size={"lg"}
                type="single"
                value={activeColor}
                onValueChange={(value) => {
                  if (!value) return;
                  setColor(value);
                }}
                className="flex gap-2">
                {COLORS.map((color) => (
                  <ToggleGroupItem
                    key={color}
                    value={color}
                    aria-label={`Color ${color}`}
                    className="size-7 rounded-full! data-[state=on]:ring-1"
                    style={{ backgroundColor: color }}>
                    {activeColor === color && <Check />}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
