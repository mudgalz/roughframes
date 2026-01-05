import type { FeedbackRow } from "@/lib/types";
import { useFeedbackStore } from "../../hooks/use-feedback-store";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFeedbackMutation } from "@/hooks/use-feedback";
import { cn, formatDate } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { usePdfStore } from "../../hooks/use-pdf-store";

interface Props {
  feedback: FeedbackRow;
}

export default function FeedbackItem({ feedback }: Props) {
  const { openExisting, activeFeedback, clear } = useFeedbackStore();
  const { remove } = useFeedbackMutation(feedback.file_id);
  const { setPage } = usePdfStore();
  const handleEdit = () => {
    // openExisting(feedback);
  };

  const handleDelete = () => {
    remove.mutate(feedback.id);
  };

  const isPdf = Boolean(feedback.annotations?.[0]?.pdf_page);

  const handleSelect = () => {
    if (!hasAnnotations) return;

    if (activeFeedback?.id === feedback.id) {
      clear();
    } else {
      if (isPdf) {
        setPage(feedback.annotations[0].pdf_page || 1);
      }
      openExisting(feedback);
    }
  };

  const hasAnnotations = feedback.annotations?.length > 0;
  const isActive = activeFeedback?.id === feedback.id;

  return (
    <Card
      onClick={handleSelect}
      className={cn(
        "group relative transition-all duration-100 py-3",
        hasAnnotations && "cursor-pointer",
        hasAnnotations && !isActive && "hover:border-muted-foreground/40",
        isActive && "border-indigo-500 bg-indigo-950/30"
      )}>
      <CardHeader className="flex items-center justify-between px-3">
        <Avatar className="justify-self-start size-7">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {feedback.added_by?.charAt(0) ?? "A"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2 items-center">
          <p className="text-sm font-semibold leading-none">
            {feedback.added_by || "Anonymous"}
          </p>
          <time className="text-xs text-muted-foreground">
            {formatDate(feedback.created_at)}
          </time>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity ${
                remove.isPending ? "opacity-100 pointer-events-none" : ""
              }`}>
              {remove.isPending ? (
                <Spinner />
              ) : (
                <MoreVertical className="size-4 " />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
              onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {/* COMMENT */}
      <CardContent className="pt-0 space-y-2 px-3">
        <p className="text-sm leading-relaxed text-foreground">
          {feedback.comment}
        </p>
      </CardContent>
    </Card>
  );
}
