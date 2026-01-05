import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useFeedbackStore } from "../hooks/use-feedback-store";
import { usePdfStore } from "../hooks/use-pdf-store";

export default function PdfToolbar() {
  const { currentPage, nextPage, prevPage, totalPages, setPage } =
    usePdfStore();
  const { clear } = useFeedbackStore();

  const [pageInput, setPageInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleNextPage = () => {
    clear();
    nextPage();
  };

  const handlePrevPage = () => {
    clear();
    prevPage();
  };

  const handleGo = () => {
    const page = Number(pageInput);

    if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
      clear();
      setPage(page);
      setOpen(false);
      setPageInput("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        title="Previous page"
        variant="ghost"
        size="icon"
        onClick={handlePrevPage}
        disabled={currentPage <= 1}>
        <ChevronLeft size={18} />
      </Button>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="px-2 h-7" title="Jump to page">
            <Kbd>
              {currentPage} / {totalPages}
            </Kbd>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-48">
          <div className="flex gap-2">
            <Input
              className="no-spinner"
              type="number"
              min={1}
              max={totalPages}
              placeholder={`1 – ${totalPages}`}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGo();
              }}
            />

            <Button variant={"outline"} onClick={handleGo} size="sm">
              Go
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        title="Next page"
        variant="ghost"
        size="icon"
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}>
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}
