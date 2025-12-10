import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { useConfirmStore } from "@/hooks/use-confirm";
import { useState } from "react";

export function GlobalConfirmDialog() {
  const { isOpen, options, close } = useConfirmStore();
  const [value, setValue] = useState("");

  if (!options) return null;

  const isPrompt = typeof options?.prompt === "string";

  return (
    <AlertDialog open={isOpen} onOpenChange={() => close(false)}>
      <AlertDialogContent className="sm:max-w-sm space-y-3">
        <AlertDialogHeader className="gap-0">
          <AlertDialogTitle>{options.title}</AlertDialogTitle>

          <AlertDialogDescription
            className={options.description ? "" : "sr-only"}>
            {options?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isPrompt && (
          <div>
            <Input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={options.prompt}
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => close(false)}
            className={options.className}>
            {options.cancelLabel ?? "Cancel"}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() => {
              if (isPrompt) close(value);
              else close(true);
            }}
            className={options.className}>
            {options.okLabel ?? (isPrompt ? "Submit" : "Confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
