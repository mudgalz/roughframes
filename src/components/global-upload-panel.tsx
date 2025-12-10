import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUploadStore } from "@/hooks/use-upload";
import { Check, ChevronDown, Info, Loader, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "./ui/spinner";

export interface UploadItem {
  id: string;
  name: string;
  status: "uploading" | "success" | "error";
  error?: string;
}

export default function GlobalUploadPanel() {
  const { uploads: uploadMap, reset } = useUploadStore();
  const uploads = Object.values(uploadMap);

  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const uploading = uploads.filter((u) => u.status === "uploading").length;
  const success = uploads.filter((u) => u.status === "success").length;
  const error = uploads.filter((u) => u.status === "error").length;

  const total = uploads.length;
  const allDone = total > 0 && uploading === 0;

  // Auto-scroll to top on change
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [uploads.length]);

  // Auto-close after 5 seconds when done
  useEffect(() => {
    if (allDone && !error) {
      const timer = setTimeout(() => {
        setIsExpanded(false);
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [allDone, reset]);

  // Header line logic
  const headerText = (() => {
    if (uploading > 0)
      return `Uploading ${uploading} item${uploading > 1 ? "s" : ""}…`;

    if (allDone && error === 0 && success > 0)
      return `${success} item${success > 1 ? "s" : ""} uploaded`;

    if (allDone && error > 0)
      return `${total} item${total > 1 ? "s" : ""} processed • ${error} failed`;

    return "Uploads";
  })();

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-4 z-50 w-72 flex flex-col">
      {/* HEADER */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-muted border border-border rounded-t-lg shadow-lg p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {uploading ? (
              <Loader className="size-4 text-green-500 animate-spin" />
            ) : allDone ? (
              <Check className="size-4 text-green-500" />
            ) : null}
            <p className="text-xs font-medium text-foreground truncate">
              {headerText}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* LIST */}
      {isExpanded && (
        <TooltipProvider>
          <div className="bg-white dark:bg-neutral-900 border border-t-0 border-border shadow-lg flex flex-col max-h-60">
            <div ref={listRef} className="flex-1 overflow-y-auto custom-scroll">
              {[...uploads].reverse().map((u) => (
                <div
                  key={u.id}
                  className="px-3 py-2 border-b border-border last:border-b-0 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors text-xs">
                  <div className="flex items-start gap-2">
                    {/* Name + Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-5">
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-medium truncate">
                            {u.name}
                          </p>

                          <p className="text-muted-foreground mt-0.5 leading-tight">
                            {u.status === "uploading"
                              ? "Uploading..."
                              : u.status === "success"
                              ? "Completed"
                              : "Failed"}
                          </p>
                        </div>

                        {u.status === "uploading" ? (
                          <Spinner className="size-3.5" />
                        ) : u.status === "error" && u.error ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="size-3.5 text-rose-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="max-w-xs text-xs">{u.error}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : u.status === "success" ? (
                          <Check className="size-3.5 flex-shrink-0" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CLOSE BUTTON */}
            <div className="border-t border-border p-2 flex justify-end">
              <button
                onClick={() => {
                  setIsExpanded(false);
                  reset();
                }}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-neutral-800 rounded transition">
                <X className="w-3 h-3" />
                Close
              </button>
            </div>
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
